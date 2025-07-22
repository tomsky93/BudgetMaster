import pytest
from fastapi.testclient import TestClient

def test_aggregate_expenses_with_month(client_fixture: TestClient, create_category, create_expense):
    food = create_category("Food")
    transport = create_category("Transport")

    create_expense(description="Lunch", amount=10.0, date="2025-04-05", category_name="Food")
    create_expense(description="Dinner", amount=20.0, date="2025-04-10", category_name="Food")
   
    create_expense(description="Taxi", amount=15.0, date="2025-04-12", category_name="Transport")

    response = client_fixture.get(
        "/aggregate-expenses", 
        params={"year": 2025, "month": 4},
    )
    assert response.status_code == 200
    data = response.json()

    data_sorted = sorted(data, key=lambda x: x["category"])
    assert len(data_sorted) == 2

    food_entry = next(item for item in data_sorted if item["category"] == "Food")
    assert food_entry["total"] == 30.0
    assert food_entry["id"] == food["id"]
    assert food_entry["color"] == food["color"]

    transport_entry = next(item for item in data_sorted if item["category"] == "Transport")
    assert transport_entry["total"] == 15.0
    assert transport_entry["id"] == transport["id"]
    assert transport_entry["color"] == transport["color"]


def test_aggregate_expenses_yearly_year_only(
    client_fixture: TestClient,
   
    create_category,
    create_expense
):
    groceries = create_category("Groceries")
    utilities = create_category("Utilities")

    create_expense(description="Beans", amount=5.0, date="2025-02-01", category_name="Groceries")
    create_expense(description="Bread", amount=3.0, date="2025-10-15", category_name="Groceries")
    create_expense(description="Electricity", amount=50.0, date="2025-02-20", category_name="Utilities")

    response = client_fixture.get(
        "/aggregate-expenses",
        params={"year": 2025},
    )
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)

    total_items = len(data)
    assert total_items % 12 == 0
    block_size = total_items // 12

    our_items = [item for item in data if item["category"] in ("Groceries", "Utilities")]
    assert len(our_items) == 2 * 12

    def month_block(month: int):
        start = (month - 1) * block_size
        return data[start : start + block_size]

    feb_block = month_block(2)
    feb_groc = next(item for item in feb_block if item["category"] == "Groceries")
    assert feb_groc["total"] == 5.0
    feb_util = next(item for item in feb_block if item["category"] == "Utilities")
    assert feb_util["total"] == 50.0

    oct_block = month_block(10)
    oct_groc = next(item for item in oct_block if item["category"] == "Groceries")
    assert oct_groc["total"] == 3.0

    mar_block = month_block(3)
    mar_groc = next(item for item in mar_block if item["category"] == "Groceries")
    assert mar_groc["total"] == 0.0

def test_aggregate_all_by_month_without_month(
    client_fixture: TestClient,
    create_category,
    create_expense,
    create_budget,
    create_income,
    create_saving_contribution, 
):
    
    resp0 = client_fixture.get(
        "/aggregate-expenses/all",
        params={"year": 2025},
    )
    assert resp0.status_code == 200
    baseline = {item["month"]: item for item in resp0.json()}

    create_category("Misc")
    create_expense(description="Item A", amount=100.0, date="2025-05-10", category_name="Misc")
    create_expense(description="Item B", amount=50.0,  date="2025-06-05", category_name="Misc")

    create_budget(amount=200.0, date="2025-05-01")
    create_budget(amount=300.0, date="2025-06-01")

    create_income(description="Salary", amount=1000.0, date="2025-05-15")
    create_income(description="Bonus",  amount=200.0,  date="2025-06-20")

    create_saving_contribution(amount=20.0, date="2025-05-30")
    create_saving_contribution(amount=30.0, date="2025-06-15")

    resp1 = client_fixture.get(
        "/aggregate-expenses/all",
        params={"year": 2025},
    )
    assert resp1.status_code == 200
    data = {item["month"]: item for item in resp1.json()}

    for month, add_exp, add_bud, add_inc, add_sav in [
        (5, 100.0, 200.0, 1000.0, 20.0),
        (6,  50.0, 300.0,  200.0, 30.0),
    ]:
        assert month in data
        got = data[month]
        base = baseline.get(month, {
            "expenses_total": 0.0,
            "budgets_total":  0.0,
            "incomes_total":  0.0,
            "savings_total":  0.0,
            "remaining_budget": 0.0,
        })

        assert got["expenses_total"]   == pytest.approx(base["expenses_total"]   + add_exp)
        assert got["budgets_total"]    == pytest.approx(base["budgets_total"]    + add_bud)
        assert got["incomes_total"]    == pytest.approx(base["incomes_total"]    + add_inc)
        assert got["savings_total"]    == pytest.approx(base["savings_total"]    + add_sav)
        assert got["remaining_budget"] == pytest.approx(got["budgets_total"] - got["expenses_total"])