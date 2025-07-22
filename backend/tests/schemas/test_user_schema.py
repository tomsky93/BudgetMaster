import pytest
from pydantic import ValidationError
from hypothesis import given, strategies as st

from schemas.user import (
    CurrencyEnum,
    LocaleEnum,
    UserBase,
    UserCreate,
    UserSchema,
    UserUpdate,
    ChangePasswordRequest,
)

def test_currency_enum_values():
    assert CurrencyEnum.USD.value == "USD"
    assert CurrencyEnum.EUR.value == "EUR"
    assert "JPY" in CurrencyEnum.__members__

def test_locale_enum_values():
    assert LocaleEnum.en_US.value == "en-US"
    assert LocaleEnum.fr_FR.value == "fr-FR"
    assert "zh_CN" in LocaleEnum.__members__

def test_userbase_valid():
    user = UserBase(username="alice", currency=CurrencyEnum.USD, locale=LocaleEnum.en_US)
    assert user.username == "alice"
    assert user.currency == CurrencyEnum.USD
    assert user.locale == LocaleEnum.en_US

def test_userbase_invalid_currency():
    with pytest.raises(ValidationError):
        UserBase(username="bob", currency="INVALID", locale=LocaleEnum.en_US)

def test_userbase_invalid_locale():
    with pytest.raises(ValidationError):
        UserBase(username="bob", currency=CurrencyEnum.USD, locale="INVALID")

def test_usercreate_inherits_userbase():
    user = UserCreate(username="eve", currency=CurrencyEnum.EUR, locale=LocaleEnum.fr_FR, password="secret")
    assert user.password == "secret"
    assert isinstance(user, UserBase)

def test_userschema_fields():
    user = UserSchema(id=1, username="john", currency=CurrencyEnum.GBP, locale=LocaleEnum.en_GB)
    assert user.id == 1
    assert user.username == "john"

def test_userupdate_partial():
    update = UserUpdate(currency=CurrencyEnum.JPY)
    assert update.currency == CurrencyEnum.JPY
    assert update.locale is None

    update2 = UserUpdate(locale=LocaleEnum.ja_JP)
    assert update2.currency is None
    assert update2.locale == LocaleEnum.ja_JP

def test_userupdate_empty():
    update = UserUpdate()
    assert update.currency is None
    assert update.locale is None

def test_changepasswordrequest():
    req = ChangePasswordRequest(new_password="newpass123")
    assert req.new_password == "newpass123"

@given(
    username=st.text(min_size=1, max_size=20),
    currency=st.sampled_from(list(CurrencyEnum)),
    locale=st.sampled_from(list(LocaleEnum)),
    password=st.text(min_size=1, max_size=20),
)
def test_usercreate_hypothesis(username, currency, locale, password):
    user = UserCreate(username=username, currency=currency, locale=locale, password=password)
    assert user.username == username
    assert user.currency == currency
    assert user.locale == locale
    assert user.password == password