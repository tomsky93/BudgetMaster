from fastapi import Request
from fastapi.responses import JSONResponse

class CRUDException(Exception):
    def __init__(self, detail: str, status_code: int = 400):
        self.detail = detail
        self.status_code = status_code

def register_exception_handlers(app):
    @app.exception_handler(CRUDException)
    async def crud_exception_handler(request: Request, exc: CRUDException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )