import pytest
from fastapi.testclient import TestClient

def test_create_saving_goal_factory_success(client_fixture: TestClient, token: str):
    payload = {
        "title": "Vacation Fund",
        "target_amount": 2000.0,
        "deadline": "2025-12-31",
        "owner_id": 1
    }
    resp = client_fixture.post(
        "/savings",
        json=payload,
        
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Vacation Fund"
    assert data["target_amount"] == 2000.0
    assert data["deadline"].startswith("2025-12-31")
    assert data["current_amount"] == 0.0
    assert data["icon"] == "fas fa-question-circle"
    assert "id" in data and "owner_id" in data


def test_create_saving_goal_factory_invalid(client_fixture: TestClient, token: str):
    payload = {
        "title": "X",
        "target_amount": "foo",  # Invalid type
        "deadline": "2025-01-01",
        "owner_id": 1
    }
    resp = client_fixture.post(
        "/savings",
        json=payload,
        
    )
    assert resp.status_code == 422


def test_list_savings(client_fixture: TestClient, token: str, create_saving_goal_factory):
    goal1 = create_saving_goal_factory(title="Emergency Fund", target_amount=5000.0, deadline="2025-06-01")
    goal2 = create_saving_goal_factory(title="New Car", target_amount=15000.0, deadline="2026-01-01")

    resp = client_fixture.get(
        "/savings/?skip=0&limit=10",
        
    )
    assert resp.status_code == 200
    data = resp.json()
    ids = [g["id"] for g in data]
    assert goal1["id"] in ids
    assert goal2["id"] in ids
    assert "X-Total-Count" in resp.headers


def test_read_single_saving_goal(client_fixture: TestClient, token: str, create_saving_goal_factory):
    goal = create_saving_goal_factory(title="Home Renovation", target_amount=10000.0, deadline="2025-08-01")
    resp = client_fixture.get(
        f"/savings/{goal['id']}",
        
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == goal["id"]
    assert data["title"] == "Home Renovation"
    assert data["target_amount"] == 10000.0
    assert data["deadline"].startswith("2025-08-01")
    assert data["current_amount"] == 0.0
    assert data["icon"] == "fas fa-question-circle"


def test_read_nonexistent_saving_goal(client_fixture: TestClient, token: str,):
    resp = client_fixture.get(
        "/savings/999999",
    )
    assert resp.status_code == 404


def test_update_saving_goal(client_fixture: TestClient, token: str, create_saving_goal_factory):
    goal = create_saving_goal_factory(title="Old Goal", target_amount=3000.0, deadline="2025-07-01")
    update_payload = {
        "title": "Updated Goal",
        "target_amount": 3500.0,
        "deadline": "2025-09-01",
        "owner_id": goal["owner_id"],
    }
    resp = client_fixture.put(
        f"/savings/{goal['id']}",
        json=update_payload,
        
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == goal["id"]
    assert data["title"] == "Updated Goal"
    assert data["target_amount"] == 3500.0
    assert data["deadline"].startswith("2025-09-01")
    assert data["icon"] == "fas fa-question-circle"


def test_update_nonexistent_saving_goal(client_fixture: TestClient, token: str,):
    update_payload = {
        "title": "Nothing",
        "target_amount": 100.0,
        "deadline": "2025-01-01",
        "current_amount": 0.0,
        "owner_id": 1, 
    }
    resp = client_fixture.put(
        "/savings/999999",
        json=update_payload,
    )

    assert resp.status_code == 404

def test_delete_saving_goal(client_fixture: TestClient, token: str, create_saving_goal_factory):
    goal = create_saving_goal_factory(title="To Delete", target_amount=1000.0, deadline="2025-10-01")
    resp = client_fixture.delete(
        f"/savings/{goal['id']}",
        
    )
    assert resp.status_code == 200
    assert resp.json() == {"detail": "Item was successfully deleted"}

    resp2 = client_fixture.get(
        f"/savings/{goal['id']}",
        
    )
    assert resp2.status_code == 404


def test_delete_nonexistent_saving_goal(client_fixture: TestClient, token: str):
    resp = client_fixture.delete(
        "/savings/999999",
        
    )
    assert resp.status_code == 404
  
