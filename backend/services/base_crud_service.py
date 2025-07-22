from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pyparsing import Enum
from exceptions import CRUDException
from sqlalchemy.orm import Session
from typing import Type, List, Optional
from dependencies import get_db
from typing import Optional
from sqlalchemy import extract
from sqlalchemy.orm import Session
from services.auth import get_current_user


class BaseCRUDService:
    def __init__(self, model, db):
        self.model = model
        self.db = db

    def create(self, obj_in: dict):
        try:
            db_obj = self.model(**obj_in)
            self.db.add(db_obj)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except Exception as e:
            self.db.rollback()
            raise CRUDException(
                detail=f"Error while creating {self.model.__name__}: {str(e)}", status_code=500)

    def get(self, id: int):
        try:
            obj = self.db.query(self.model).filter(self.model.id == id).first()
            if not obj:
                self.db.rollback()
                raise CRUDException(
                    detail=f"{self.model.__name__} with id {id} not found",
                    status_code=404
                )
            return obj
        except CRUDException:
            raise
        except Exception as e:
            self.db.rollback()
            raise CRUDException(
                detail=f"Error while downloading {self.model.__name__}: {str(e)}",
                status_code=500
            )

    def update(self, db_obj, obj_in):
        try:
            data = obj_in.model_dump() if hasattr(obj_in, 'model_dump') else obj_in
            for key, value in data.items():
                setattr(db_obj, key, value)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except Exception as e:
            self.db.rollback()
            raise CRUDException(
                detail=f"Error when updating {self.model.__name__}: {str(e)}", status_code=500)

    def delete(self, id: int):
        try:
            db_obj = self.get(id)
            self.db.delete(db_obj)
            self.db.commit()
            return db_obj
        except CRUDException:
            raise
        except Exception as e:
            self.db.rollback()
            raise CRUDException(
                detail=f"Error when deleting {self.model.__name__}: {str(e)}", status_code=500)

    def get_by_owner(self, obj_id: int, owner_id: int):
        instance = (
            self.db.query(self.model)
            .filter(self.model.id == obj_id)
            .first()
        )
        if not instance:
            raise CRUDException(
                detail=f"{self.model.__name__} with id {obj_id} not found",
                status_code=404
            )
        if instance.owner_id != owner_id:
            raise CRUDException(
                detail=f"You don't have access to {self.model.__name__}",
                status_code=403
            )
        return instance


def get_service(model_service: Type[BaseCRUDService]):
    def _get_service(db: Session = Depends(get_db)):
        return model_service(db)
    return _get_service


class GenericCRUDRouter:
    def __init__(
        self,
        *,
        prefix: str,
        tags: list[str | Enum] | None,
        service_class: Type,
        create_schema: Type,
        read_schema: Type,
        update_schema: Optional[Type] = None,
    ):
        self.router = APIRouter(prefix=prefix, tags=tags)
        self.service_class = service_class
        self.create_schema = create_schema
        self.read_schema = read_schema
        self.update_schema = update_schema

        self.register_routes()

    def register_routes(self):
        @self.router.get(
            "/",
            response_model=List[self.read_schema],
            responses={
                200: {
                    "headers": {
                        "X-Total-Count": {
                            "schema": {"type": "integer"},
                        }
                    },
                }
            },
        )
        async def read_items(
            response: Response,
            skip: int = 0,
            limit: int = 100,
            date: Optional[str] = None,
            month: Optional[int] = None,
            year: Optional[int] = None,
            db: Session = Depends(get_db),
            current_user=Depends(get_current_user),
        ):
            service = self.service_class(db)
            model = service.model

            q = db.query(model).filter(model.owner_id == current_user.id)
            if date:
                q = q.filter(model.date == date)
            if month and year:
                q = q.filter(
                    extract("month", model.date) == month,
                    extract("year", model.date) == year,
                )

            total = q.count()
            items = q.offset(skip).limit(limit).all()

            response.headers["X-Total-Count"] = str(total)
            return items

        @self.router.post("/", response_model=self.read_schema)
        async def create_item(
            item: self.create_schema,  # type: ignore
            request: Request,
            service=Depends(get_service(self.service_class)),
            current_user=Depends(get_current_user),
        ):
            item_data = item.model_dump()
            item_data["owner_id"] = current_user.id
            created = service.create(item_data)
            return created

        @self.router.get("/{item_id}", response_model=self.read_schema)
        async def read_item(
            item_id: int,
            service=Depends(get_service(self.service_class)),
            current_user=Depends(get_current_user),
        ):
            instance = service.get_by_owner(item_id, current_user.id)
            if not instance:
                raise HTTPException(
                    status_code=404, detail="Item not found")
            return instance

        if self.update_schema:
            @self.router.put("/{item_id}", response_model=self.read_schema)
            async def update_item(
                item_id: int,
                item: self.update_schema,  # type: ignore
                request: Request,
                service=Depends(get_service(self.service_class)),
                current_user=Depends(get_current_user),
            ):
                instance = service.get_by_owner(item_id, current_user.id)
                if not instance:
                    raise HTTPException(
                        status_code=404, detail="Item not found")
                updated = service.update(instance, item)

                return updated

        @self.router.delete(
            "/{item_id}",
            response_model=dict,
            responses={
                200: {"description": "Item was successfully deleted"},
                404: {"description": "Item not found"},
            },
        )
        async def delete_item(
            item_id: int,
            service=Depends(get_service(self.service_class)),
            current_user=Depends(get_current_user),
        ):
            instance = service.get_by_owner(item_id, current_user.id)
            if not instance:
                raise HTTPException(
                    status_code=404, detail="Item not found")
            service.delete(item_id)
            return {"detail": "Item was successfully deleted"}
