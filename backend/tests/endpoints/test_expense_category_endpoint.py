import pytest
from fastapi.testclient import TestClient

def test_create_category_success(client_fixture: TestClient, token: str):
    resp = client_fixture.post(
        "/expense_categories/",
        json={"name": "Transport"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Transport"
    assert "id" in data


@pytest.mark.parametrize("payload, status", [
    ({}, 422),
    ({"name": 123}, 422),
])
def test_create_category_invalid(client_fixture: TestClient, token: str, payload, status):
    resp = client_fixture.post(
        "/expense_categories/",
        json=payload,
    )
    assert resp.status_code == status


def test_list_categories(client_fixture: TestClient, token: str, create_category):
    c1 = create_category("Food")
    c2 = create_category("Utilities")

    resp = client_fixture.get(
        "/expense_categories/?skip=0&limit=10",
    )
    assert resp.status_code == 200
    data = resp.json()

    assert any(c["id"] == c1["id"] for c in data)
    assert any(c["id"] == c2["id"] for c in data)

    assert "X-Total-Count" in resp.headers


def test_read_single_category(client_fixture: TestClient, token: str, create_category):
    c = create_category("Health")
    resp = client_fixture.get(
        f"/expense_categories/{c['id']}",
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == c["id"]
    assert data["name"] == "Health"


def test_read_nonexistent_category(client_fixture: TestClient, token: str):
    resp = client_fixture.get(
        "/expense_categories/999999",
    )
    assert resp.status_code == 404


def test_update_category(client_fixture: TestClient, token: str, create_category):
    c = create_category("OldName")
    resp = client_fixture.put(
        f"/expense_categories/{c['id']}",
        json={"name": "NewName"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == c["id"]
    assert data["name"] == "NewName"


def test_update_nonexistent_category(client_fixture: TestClient, token: str):
    resp = client_fixture.put(
        "/expense_categories/999999",
        json={"name": "Whatever"},
    )
    assert resp.status_code == 404


def test_delete_category(client_fixture: TestClient, token: str, create_category):
    c = create_category("ToDelete")
    resp = client_fixture.delete(
        f"/expense_categories/{c['id']}",
    )
    assert resp.status_code == 200
    assert resp.json() == {"detail": "Item was successfully deleted"}

    resp2 = client_fixture.get(
        f"/expense_categories/{c['id']}",
    )
    assert resp2.status_code == 404
