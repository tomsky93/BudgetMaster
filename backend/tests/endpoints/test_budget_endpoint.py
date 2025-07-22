import pytest
from fastapi.testclient import TestClient


def test_read_budget_without_params_returns_null(client_fixture: TestClient, token: str):
    resp = client_fixture.get("/budget")
    assert resp.status_code == 200
    assert resp.json() == []


def test_read_budget_with_month_year(client_fixture: TestClient,
                                     token: str,
                                     create_budget):
    created_budget = create_budget(amount=100.0, date="2025-04-01")

    resp = client_fixture.get(
        "/budget?month=4&year=2025",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 200

    data = resp.json()
    assert isinstance(data, list)
    assert any(
        b["id"] == created_budget["id"] and
        b["amount"] == 100.0 and
        b["date"] == "2025-04-01"
        for b in data
    )


def test_read_budget_nonexistent_month_year_returns_null(client_fixture: TestClient, token: str):
    resp = client_fixture.get("/budget?month=12&year=1999")
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.parametrize("payload, expected_status", [
    ({"amount": 500.0, "date": "2025-07-01"}, 200),
    ({"amount": "foo", "date": "2025-07-01"}, 422),
    ({}, 422),
])
def test_generic_create_budget(client_fixture: TestClient, token: str, payload, expected_status: int):
    resp = client_fixture.post("/budget/", json=payload)
    assert resp.status_code == expected_status
    if expected_status == 200:
        data = resp.json()
        assert "id" in data
        assert data["amount"] == payload["amount"]
        assert data["date"] == payload["date"]


def test_generic_read_budgets_list(client_fixture: TestClient, token: str, create_budget):
    b1 = create_budget(amount=100.0, date="2025-01-01")
    b2 = create_budget(amount=200.0, date="2025-01-15")
    resp = client_fixture.get("/budget/?skip=0&limit=10")
    assert resp.status_code == 200
    data = resp.json()

    assert any(b["id"] == b1["id"] for b in data)
    assert any(b["id"] == b2["id"] for b in data)

    assert "X-Total-Count" in resp.headers


def test_read_single_budget(client_fixture: TestClient, token: str, create_budget):
    b = create_budget(amount=300.0, date="2025-09-01")
    resp = client_fixture.get(f"/budget/{b['id']}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == b["id"]
    assert data["amount"] == 300.0


def test_update_budget(client_fixture: TestClient, token: str, create_budget):
    b = create_budget(amount=400.0, date="2025-08-01")
    update_payload = {"amount": 450.0, "date": "2025-08-15"}
    resp = client_fixture.put(f"/budget/{b['id']}", json=update_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["amount"] == 450.0
    assert data["date"].startswith("2025-08-")


def test_delete_budget(client_fixture: TestClient, token: str, create_budget):
    b = create_budget(amount=500.0, date="2025-11-01")
    resp = client_fixture.delete(f"/budget/{b['id']}")
    assert resp.status_code == 200
    assert resp.json() == {"detail": "Item was successfully deleted"}

    resp2 = client_fixture.get(f"/budget/{b['id']}")
    assert resp2.status_code == 404
