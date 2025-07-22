import pytest
from fastapi.testclient import TestClient

def test_create_income_success(client_fixture: TestClient, token: str):
    payload = {
        "description": "Salary June",
        "amount": 3000.0,
        "category": "Salary",
        "date": "2025-06-01",
    }
    resp = client_fixture.post(
        "/income/",
        json=payload,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["description"] == "Salary June"
    assert data["amount"] == 3000.0
    assert data["category"] == "Salary"
    assert data["date"].startswith("2025-06-01")
    assert "id" in data

@pytest.mark.parametrize("payload, status", [
    ({}, 422), 
    ({"description": "X", "amount": "foo", "category": "Salary"}, 422), 
    ({"amount": 100.0, "category": "Salary", "date": "2025-01-01"}, 422), 
    ({"description": "X", "amount": 10.0, "date": "2025-01-01"}, 422),  
    ({"description": "X", "amount": 10.0, "category": "invalid", "date": "2025-01-01"}, 422),  
])

def test_create_income_invalid(client_fixture: TestClient, token: str, payload, status):
    resp = client_fixture.post(
        "/income/",
        json=payload,
    )
    assert resp.status_code == status

def test_list_incomes(client_fixture: TestClient, token: str, create_income):
    inc1 = create_income("Freelance Work", 500.0, category="Salary", date="2025-06-02")
    inc2 = create_income("Interest Payout", 150.0, category="Interests", date="2025-06-03")

    resp = client_fixture.get(
        "/income/?skip=0&limit=10",
    )
    assert resp.status_code == 200
    data = resp.json()
    ids = [i["id"] for i in data]
    assert inc1["id"] in ids
    assert inc2["id"] in ids
    assert "X-Total-Count" in resp.headers


def test_read_single_income(client_fixture: TestClient, token: str, create_income):
    inc = create_income("Monthly Rent", 1200.0, category="Rent", date="2025-06-04")
    resp = client_fixture.get(
        f"/income/{inc['id']}",
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == inc["id"]
    assert data["description"] == "Monthly Rent"
    assert data["category"] == "Rent"


def test_read_nonexistent_income(client_fixture: TestClient, token: str):
    resp = client_fixture.get(
        "/income/999999",
    )
    assert resp.status_code == 404


def test_update_income(client_fixture: TestClient, token: str, create_income):
    inc = create_income("Old Income", 123.0, category="Other", date="2025-06-05")
    update_payload = {
        "description": "Updated Income",
        "amount": 321.0,
        "category": "Salary",
        "date": "2025-06-06",
    }
    resp = client_fixture.put(
        f"/income/{inc['id']}",
        json=update_payload,
        
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == inc["id"]
    assert data["description"] == "Updated Income"
    assert data["amount"] == 321.0
    assert data["category"] == "Salary"
    assert data["date"].startswith("2025-06-06")

def test_update_nonexistent_income(client_fixture: TestClient, token: str):
    resp = client_fixture.put(
        "/income/999999",
        json={
            "description": "Nothing",
            "amount": 1.0,
            "category": "Other",
            "date": "2025-01-01",
        },
    )
    assert resp.status_code == 404


def test_delete_income(client_fixture: TestClient, token: str, create_income):
    inc = create_income("To Delete", 75.0, category="Rent", date="2025-06-07")
    resp = client_fixture.delete(
        f"/income/{inc['id']}",
    )
    assert resp.status_code == 200
    assert resp.json() == {"detail": "Item was successfully deleted"}

    resp2 = client_fixture.get(
        f"/income/{inc['id']}",
    )
    
    assert resp2.status_code == 404
