import pytest
from fastapi.testclient import TestClient

def test_create_expense_success(client_fixture: TestClient, create_category, create_expense):
    cat = create_category("Food")
    assert cat["name"] == "Food"
    
    e = create_expense("Lunch", 25.5, date="2025-05-10", category_name="Food")
    assert e["category_name"] == cat["name"]
    assert e["description"] == "Lunch"

@pytest.mark.parametrize("payload, status", [
    ({}, 422),
    ({"description": "Bad", "amount": "foo"}, 422),
    ({"amount": 10.0, "category_id": 1, "date": "2025-01-01"}, 422),
])

def test_create_expense_invalid(client_fixture: TestClient, payload, status):
    resp = client_fixture.post("/expenses/", json=payload)
    assert resp.status_code == status

def test_list_expenses(client_fixture: TestClient, create_expense):
    e1 = create_expense("Shoes", 100.0, date="2025-06-01", category_name="Shopping")
    e2 = create_expense("Book",  20.0,  date="2025-06-02", category_name="Books")

    resp = client_fixture.get("/expenses/?skip=0&limit=100")
    assert resp.status_code == 200
    data = resp.json()

    june = [d for d in data if d["date"].startswith("2025-06-")]
    ids = [d["id"] for d in june]

    assert e1["id"] in ids
    assert e2["id"] in ids
    assert "X-Total-Count" in resp.headers

def test_read_single_expense(client_fixture: TestClient, create_expense):
    e = create_expense("Coffee", 5.0, date="2025-06-03")
    resp = client_fixture.get(f"/expenses/{e['id']}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == e["id"]
    assert data["description"] == "Coffee"

def test_read_nonexistent_expense(client_fixture: TestClient):
    resp = client_fixture.get("/expenses/999999")
    assert resp.status_code == 404

def test_update_expense(client_fixture: TestClient, create_expense):
    e = create_expense("Old Desc", 30.0, date="2025-06-04")
    update_payload = {
        "description": "Updated Desc",
        "amount": 35.0,
        "category_id": e["category_id"],
        "date": "2025-06-05",
    }
    resp = client_fixture.put(f"/expenses/{e['id']}", json=update_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["description"] == "Updated Desc"
    assert data["amount"] == 35.0

def test_update_nonexistent_expense(client_fixture: TestClient):
    resp = client_fixture.put(
        "/expenses/999999",
        json={
            "description": "X",
            "amount": 1.0,
            "category_id": 1,
            "date": "2025-01-01",
        },
    )
    assert resp.status_code == 404

def test_delete_expense(client_fixture: TestClient, create_expense):
    e = create_expense("To Delete", 10.0, date="2025-06-06")
    resp = client_fixture.delete(f"/expenses/{e['id']}")
    assert resp.status_code == 200
    assert resp.json() == {"detail": "Item was successfully deleted"}

    resp2 = client_fixture.get(f"/expenses/{e['id']}")
    assert resp2.status_code == 404
