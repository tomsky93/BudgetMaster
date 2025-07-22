import pytest
from fastapi.testclient import TestClient


def test_create_recurring_expense_success(create_recurring_expense):
    r = create_recurring_expense(
        description="Gym Membership",
        amount=50.0,
        frequency="monthly",
        next_due_date="2025-08-01",
        category_name="Health"
    )

    assert r["description"] == "Gym Membership"
    assert r["amount"] == 50.0
    assert r["frequency"] == "monthly"
    assert r["next_due_date"].startswith("2025-08-01")
    assert "id" in r and "owner_id" in r and r["category_name"] == "Health"


@pytest.mark.parametrize("payload", [
    {},
    {"description": "X"},
    {"amount": 10.0},
    {"description": "X", "amount": 10.0, "category_id": 1},
    {"description": "X", "amount": 10.0, "category_id": 1, "frequency": "weekly"},
    {"description": "X", "amount": 10.0,
        "category_id": 1, "next_due_date": "2025-06-01"},
    {"description": "X", "amount": "foo", "category_id": 1,
        "frequency": "monthly", "next_due_date": "2025-06-01"},
])
def test_create_recurring_expense_invalid(client_fixture: TestClient, token: str, payload):
    resp = client_fixture.post("/recurring_expenses/", json=payload)
    assert resp.status_code == 422


def test_list_recurring_expenses(client_fixture: TestClient, token: str, create_recurring_expense):
    r1 = create_recurring_expense(
        "Rent", 1200.0, frequency="monthly", next_due_date="2025-07-01")
    r2 = create_recurring_expense(
        "Yoga Class", 30.0, frequency="weekly", next_due_date="2025-06-15")

    resp = client_fixture.get("/recurring_expenses/?skip=0&limit=10")
    assert resp.status_code == 200
    data = resp.json()
    ids = [r["id"] for r in data]
    assert r1["id"] in ids
    assert r2["id"] in ids
    assert "X-Total-Count" in resp.headers


def test_read_single_recurring_expense(client_fixture: TestClient, token: str, create_recurring_expense):
    r = create_recurring_expense(
        "Magazine", 5.0, frequency="monthly", next_due_date="2025-06-05")
    resp = client_fixture.get(f"/recurring_expenses/{r['id']}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == r["id"]
    assert data["description"] == "Magazine"
    assert data["frequency"] == "monthly"


def test_read_nonexistent_recurring_expense(client_fixture: TestClient, token: str):
    resp = client_fixture.get("/recurring_expenses/999999")
    assert resp.status_code == 404


def test_update_recurring_expense(client_fixture: TestClient, token: str, create_recurring_expense):
    r = create_recurring_expense(
        "Old Sub", 15.0, frequency="weekly", next_due_date="2025-06-10")
    update_payload = {
        "description": "New Sub",
        "amount": 25.0,
        "category_id": r["category_id"],
        "frequency": "yearly",
        "next_due_date": "2026-06-10",
    }
    resp = client_fixture.put(
        f"/recurring_expenses/{r['id']}", json=update_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == r["id"]
    assert data["description"] == "New Sub"
    assert data["amount"] == 25.0
    assert data["frequency"] == "yearly"
    assert data["next_due_date"].startswith("2026-06-10")


def test_update_nonexistent_recurring_expense(client_fixture: TestClient, token: str):
    payload = {
        "description": "Foo",
        "amount": 1.0,
        "category_id": 1,
        "frequency": "monthly",
        "next_due_date": "2025-06-01",
    }
    resp = client_fixture.put("/recurring_expenses/999999", json=payload)
    assert resp.status_code == 404


def test_delete_recurring_expense(client_fixture: TestClient, token: str, create_recurring_expense):
    r = create_recurring_expense(
        "To Delete", 10.0, frequency="monthly", next_due_date="2025-06-07")
    resp = client_fixture.delete(f"/recurring_expenses/{r['id']}")
    assert resp.status_code == 200
    assert resp.json() == {"detail": "Item was successfully deleted"}

    resp2 = client_fixture.get(f"/recurring_expenses/{r['id']}")
    assert resp2.status_code == 404
