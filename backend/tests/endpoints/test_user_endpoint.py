from fastapi.testclient import TestClient
from settings import COOKIE_KEY

def test_login_incorrect(client_fixture: TestClient):
    response = client_fixture.post(
        "/token",
        data={"username": "wrong", "password": "invalid"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_login_success(client_fixture: TestClient):
    payload = {"username": "user2", "password": "pass123", "currency": "USD", "locale": "en-US"}
    reg = client_fixture.post("/register", json=payload)
    assert reg.status_code == 201

    login = client_fixture.post(
        "/token",
        data={"username": "user2", "password": "pass123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login.status_code == 200
    assert login.json()["message"] == "Login successful"
   
    assert COOKIE_KEY in login.cookies

def test_read_me_and_profile(client_fixture: TestClient, token: str):
    client_fixture.cookies.set(COOKIE_KEY, token, domain="testserver", path="/")

    me = client_fixture.get("/me")
    assert me.status_code == 200
    assert me.json()["username"] == "testuser"

    profile = client_fixture.get("/profile")
    assert profile.status_code == 200
    assert profile.json()["username"] == "testuser"

def test_register_existing_username(client_fixture: TestClient):
    payload = {"username": "testuser", "password": "secret", "currency": "USD", "locale": "en-US"}
    resp = client_fixture.post("/register", json=payload)
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Username already registered"

def test_change_password_conflict(client_fixture: TestClient, token: str):
    client_fixture.cookies.set(COOKIE_KEY, token, domain="testserver", path="/")

    payload = {"new_password": "secret"}
    resp = client_fixture.post("/change-password", json=payload)
    assert resp.status_code == 409
    assert resp.json()["detail"] == "The new password must not be the same as the current one."


def test_change_password_success(client_fixture: TestClient, token: str):
    client_fixture.cookies.set(COOKIE_KEY, token, domain="testserver", path="/")
    payload = {"new_password": "newsecret"}
    resp = client_fixture.post("/change-password", json=payload)
    assert resp.status_code == 200
    assert resp.json()["message"] == "Password changed successfully."


def test_update_profile_no_changes(client_fixture: TestClient, token: str):
    client_fixture.cookies.set(COOKIE_KEY, token, domain="testserver", path="/")
    payload = {}
    resp = client_fixture.patch("/update-profile", json=payload)
    assert resp.status_code == 400
    assert resp.json()["detail"] == "No changes were made to the profile."


def test_update_profile_success(client_fixture: TestClient, token: str):
    client_fixture.cookies.set(COOKIE_KEY, token, domain="testserver", path="/")

    payload = {"currency": "EUR"}
    resp = client_fixture.patch("/update-profile", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["currency"] == "EUR"

    payload = {"locale": "fr-FR"}
    resp = client_fixture.patch("/update-profile", json=payload)
    assert resp.status_code == 200
    assert resp.json()["locale"] == "fr-FR"

    payload = {"currency": "GBP", "locale": "en-GB"}
    resp = client_fixture.patch("/update-profile", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["currency"] == "GBP"
    assert data["locale"] == "en-GB"


def test_logout(client_fixture: TestClient, token: str):
    client_fixture.cookies.set(COOKIE_KEY, token, domain="testserver", path="/")

    resp = client_fixture.post("/logout")
    assert resp.status_code == 200
    assert resp.json()["message"] == "Logout successful"

    set_cookie = resp.headers.get("set-cookie")
    assert set_cookie is not None
    assert f"{COOKIE_KEY}=" in set_cookie
    assert "Max-Age=0" in set_cookie
