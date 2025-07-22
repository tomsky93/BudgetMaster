import sys, os
from typing import Optional
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import pytest
from fastapi.testclient import TestClient
from models.user import User
from models.expense_category import ExpenseCategory
from models.transaction import Expense, Income, SavingGoal
from models.budget import Budget
import datetime
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
from database import Base, get_engine, get_session_local, get_db

TEST_ENGINE = get_engine()
TestingSessionLocal = get_session_local(TEST_ENGINE)

from main import app, create_scheduler
app.state.scheduler = create_scheduler(TestingSessionLocal)

app.state.scheduler.start = lambda *args, **kwargs: None
app.state.scheduler.shutdown = lambda *args, **kwargs: None

@pytest.fixture(scope="module")
def client_fixture():
    Base.metadata.create_all(bind=TEST_ENGINE)

    def _get_test_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _get_test_db

    with TestClient(app) as c:
        yield c

    Base.metadata.drop_all(bind=TEST_ENGINE)
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.drop_all(bind=TEST_ENGINE)
    Base.metadata.create_all(bind=TEST_ENGINE)
    db = TestingSessionLocal()
    yield db
    db.rollback()
    db.close()


@pytest.fixture(scope="module")
def token(client_fixture: TestClient) -> str:
    payload = {
        "username": "testuser",
        "password": "secret",
        "currency": "USD",
        "locale": "en-US",
    }
    r = client_fixture.post("/register", json=payload)
    if r.status_code not in (200, 201, 400):
        pytest.fail(f"Registration: status={r.status_code}, body={r.text}")

    tok = client_fixture.post(
        "/token",
        data={"username": "testuser", "password": "secret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert tok.status_code == 200

    cookies = tok.cookies
    if not cookies:
        pytest.fail("No cookies found in response")
    return next(iter(cookies.values()))


@pytest.fixture
def user(db_session):
    u = User(
        username="testuser",
        hashed_password="dummyhash",
        currency="USD",
        locale="en-US",
    )
    db_session.add(u)
    db_session.commit()
    db_session.refresh(u)
    return u

@pytest.fixture(scope="module")
def create_budget(token: str, client_fixture: TestClient):
    def _create_budget(amount: float = 1000.0, date: str = "2025-04-01"):
        budget_payload = {
            "amount": amount,
            "date": date,
        }
        response = client_fixture.post("/budget", json=budget_payload)
       
        assert response.status_code == 200
        data = response.json()
        assert data["amount"] == amount
        assert data["date"] == date
        return data
    return _create_budget

@pytest.fixture(scope="module")
def create_category(token: str, client_fixture: TestClient):
    cache: dict[str, dict] = {}
    def _factory(name: str = "Default"):
        if name in cache:
            return cache[name]
        resp = client_fixture.post("/expense_categories/", json={"name": name})
        assert resp.status_code == 200
        data = resp.json()
        cache[name] = data
        return data
    return _factory

@pytest.fixture(scope="module")
def create_income(token: str, client_fixture: TestClient):
    def _factory(
        description: str = "Test income",
        amount: float = 1000.0,
        date: str = "2025-04-15",
        category: str = "Salary"
    ):
        payload = {
            "description": description,
            "amount": amount,
            "category": category,
            "date": date,
        }
        resp = client_fixture.post("/income/", json=payload)
        assert resp.status_code == 200
        data = resp.json()

        assert data["description"] == description
        assert data["amount"] == amount
        assert data["category"] == category
        assert data["date"].startswith(date)
        assert "id" in data
        return data

    return _factory


@pytest.fixture(scope="module")
def create_expense(token: str, client_fixture: TestClient, create_category):
    def _factory(
        description: str = "Test expense",
        amount: float = 50.0,
        date: str = "2025-04-15",
        category_name: str = "Default"
    ):
        cat = create_category(category_name)

        payload = {
            "description":    description,
            "amount":         amount,
            "category_id":    cat["id"],
            "date":           date,
        }
        resp = client_fixture.post("/expenses/", json=payload)
        assert resp.status_code == 200
        data = resp.json()

        assert data["description"] == description
        assert data["amount"] == amount
        assert data["category_id"] == cat["id"]
        assert data["date"].startswith(date)
        assert "id" in data
        return data

    return _factory


@pytest.fixture(scope="module")
def create_recurring_expense(token: str, client_fixture: TestClient, create_category):
    def _factory(
        description: str = "Subscription",
        amount: float = 20.0,
        frequency: str = "monthly",
        next_due_date: str = "2025-06-01",
        category_name: str = "Default"
    ):
        cat = create_category(category_name)
        payload = {
            "description": description,
            "amount": amount,
            "category_id": cat["id"],
            "frequency": frequency,
            "next_due_date": next_due_date,
        }
        resp = client_fixture.post(
            "/recurring_expenses/",
            json=payload,
            
        )
        assert resp.status_code == 200
        data = resp.json()
   
        assert data["description"] == description
        assert data["amount"] == amount
        assert data["category_id"] == cat["id"]
        assert data["frequency"] == frequency
        assert data["next_due_date"].startswith(next_due_date)
   
        assert "id" in data
        assert "owner_id" in data
        assert "category_name" in data
        return data

    return _factory

@pytest.fixture
def create_saving_goal_factory(token: str, client_fixture: TestClient, user):
    
    def _factory(
        title: str = "Test Goal",
        target_amount: float = 1000.0,
        deadline: str = "2025-12-31",
        icon: str = "fas fa-question-circle"
    ):
        payload = {
            "title": title,
            "target_amount": target_amount,
            "deadline": deadline,
            "owner_id": user.id,
            "icon": icon
        }
        
        resp = client_fixture.post("/savings/", json=payload)
        assert resp.status_code == 200
        
        data = resp.json()
        assert data["title"] == title
        assert data["target_amount"] == target_amount
        assert data["deadline"].startswith(deadline)
        assert data["icon"] == icon
        assert data["owner_id"] == user.id
        
        return data

    return _factory

@pytest.fixture
def create_saving_contribution(
    token: str,
    client_fixture: TestClient,
    create_saving_goal_factory,  
):
    def _factory(
        amount: float = 100.0,
        date: str = "2025-01-01",
        goal_id: Optional[int] = None,
    ):
        if goal_id is None:
            goal = create_saving_goal_factory()
            goal_id = goal["id"]

        payload = {
            "saving_goal_id": goal_id,
            "amount": amount,
            "date": date,
        }
        headers = {"Authorization": f"Bearer {token}"}

        resp = client_fixture.post(f"/deposit/{goal_id}", json=payload, headers=headers)
        assert resp.status_code == 200

        data = resp.json()
        assert data["saving_goal_id"] == goal_id
        assert data["amount"] == amount
        assert data["date"].startswith(date)

        return data

    return _factory