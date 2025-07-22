import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import pytest
from unittest.mock import MagicMock
from services.base_crud_service import BaseCRUDService, CRUDException

class DummyModel:
    id = None 
    
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
            
DummyModel.__name__ = "DummyModel"

def test_create_success():
    db_mock = MagicMock()
    service = BaseCRUDService(DummyModel, db_mock)
    input_data = {"id": 1, "name": "Test"}
    
    result = service.create(input_data)
    
    db_mock.add.assert_called_once_with(result)
    db_mock.commit.assert_called_once()
    db_mock.refresh.assert_called_once_with(result)
    assert isinstance(result, DummyModel)
    assert result.id == 1
    assert result.name == "Test"

def test_create_exception():
    db_mock = MagicMock()
    db_mock.commit.side_effect = Exception("commit error")
    service = BaseCRUDService(DummyModel, db_mock)
    input_data = {"id": 1, "name": "Test"}
    
    with pytest.raises(CRUDException) as exc_info:
        service.create(input_data)
    
    db_mock.rollback.assert_called_once()
    assert "Error while creating" in exc_info.value.detail
    assert "commit error" in exc_info.value.detail

def test_get_success():
    db_mock = MagicMock()
    dummy_obj = DummyModel(id=1, name="Test")
    db_mock.query.return_value.filter.return_value.first.return_value = dummy_obj
    service = BaseCRUDService(DummyModel, db_mock)
    
    result = service.get(1)
    
    db_mock.query.assert_called_once_with(DummyModel)
    assert result == dummy_obj

def test_get_not_found():
    db_mock = MagicMock()
    db_mock.query.return_value.filter.return_value.first.return_value = None
    service = BaseCRUDService(DummyModel, db_mock)
    
    with pytest.raises(CRUDException) as exc_info:
        service.get(1)
    
    db_mock.rollback.assert_called_once()
    assert "not found" in exc_info.value.detail

def test_get_exception():
    db_mock = MagicMock()
    db_mock.query.side_effect = Exception("query error")
    service = BaseCRUDService(DummyModel, db_mock)
    
    with pytest.raises(CRUDException) as exc_info:
        service.get(1)
    
    db_mock.rollback.assert_called_once()
    assert "Error while downloading" in exc_info.value.detail
    assert "query error" in exc_info.value.detail

def test_update_success():
    db_mock = MagicMock()
    service = BaseCRUDService(DummyModel, db_mock)
    dummy_obj = DummyModel(id=1, name="Old")
    update_data = {"name": "New"}
    
    result = service.update(dummy_obj, update_data)
    
    assert result.name == "New"
    db_mock.commit.assert_called_once()
    db_mock.refresh.assert_called_once_with(dummy_obj)

def test_update_exception():
    db_mock = MagicMock()
    db_mock.commit.side_effect = Exception("commit error")
    service = BaseCRUDService(DummyModel, db_mock)
    dummy_obj = DummyModel(id=1, name="Old")
    update_data = {"name": "New"}
    
    with pytest.raises(CRUDException) as exc_info:
        service.update(dummy_obj, update_data)
    
    db_mock.rollback.assert_called_once()
    assert "Error when updating" in exc_info.value.detail
    assert "commit error" in exc_info.value.detail

def test_delete_success():
    db_mock = MagicMock()
    dummy_obj = DummyModel(id=1, name="Test")
    db_mock.query.return_value.filter.return_value.first.return_value = dummy_obj
    service = BaseCRUDService(DummyModel, db_mock)
    
    result = service.delete(1)
    
    db_mock.delete.assert_called_once_with(dummy_obj)
    db_mock.commit.assert_called_once()
    assert result == dummy_obj

def test_delete_exception_generic():
    db_mock = MagicMock()
    dummy_obj = DummyModel(id=1, name="Test")
    db_mock.query.return_value.filter.return_value.first.return_value = dummy_obj
    db_mock.delete.side_effect = Exception("delete error")
    service = BaseCRUDService(DummyModel, db_mock)
    
    with pytest.raises(CRUDException) as exc_info:
        service.delete(1)
    
    db_mock.rollback.assert_called_once()
    assert "Error when deleting" in exc_info.value.detail
    assert "delete error" in exc_info.value.detail

def test_delete_crud_exception_from_get():
    db_mock = MagicMock()
    db_mock.query.return_value.filter.return_value.first.return_value = None
    service = BaseCRUDService(DummyModel, db_mock)
    
    with pytest.raises(CRUDException) as exc_info:
        service.delete(1)
    
    assert "not found" in exc_info.value.detail