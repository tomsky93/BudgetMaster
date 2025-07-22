from pydantic import BaseModel, ConfigDict
from enum import Enum
from typing import Optional

class CurrencyEnum(str, Enum):
    ARS = "ARS"
    AUD = "AUD"
    BRL = "BRL"
    CAD = "CAD"
    CHF = "CHF"
    CNY = "CNY"
    CZK = "CZK"
    DKK = "DKK"
    EUR = "EUR"
    GBP = "GBP"
    HUF = "HUF"
    IDR = "IDR"
    INR = "INR"
    JPY = "JPY"
    KRW = "KRW"
    MXN = "MXN"
    MYR = "MYR"
    NOK = "NOK"
    PLN = "PLN"
    RON = "RON"
    RUB = "RUB"
    SAR = "SAR"
    SEK = "SEK"
    THB = "THB"
    TRY = "TRY"
    TWD = "TWD"
    USD = "USD"
    VND = "VND"
    
class LocaleEnum(str, Enum):
    cs_CZ = "cs-CZ"
    da_DK = "da-DK"
    de_AT = "de-AT"
    de_CH = "de-CH"
    de_DE = "de-DE"
    el_GR = "el-GR"
    en_AU = "en-AU"
    en_CA = "en-CA"
    en_GB = "en-GB"
    en_IE = "en-IE"
    en_IN = "en-IN"
    en_NZ = "en-NZ"
    en_US = "en-US"
    es_AR = "es-AR"
    es_ES = "es-ES"
    es_MX = "es-MX"
    fi_FI = "fi-FI"
    fr_BE = "fr-BE"
    fr_CA = "fr-CA"
    fr_FR = "fr-FR"
    hi_IN = "hi-IN"
    hu_HU = "hu-HU"
    id_ID = "id-ID"
    it_IT = "it-IT"
    ja_JP = "ja-JP"
    ko_KR = "ko-KR"
    lt_LT = "lt-LT"
    ms_MY = "ms-MY"
    nl_NL = "nl-NL"
    no_NO = "no-NO"
    pl_PL = "pl-PL"
    pt_BR = "pt-BR"
    pt_PT = "pt-PT"
    ro_RO = "ro-RO"
    ru_RU = "ru-RU"
    sv_SE = "sv-SE"
    th_TH = "th-TH"
    tr_TR = "tr-TR"
    vi_VN = "vi-VN"
    zh_CN = "zh-CN"
    zh_TW = "zh-TW"

class UserBase(BaseModel):
    username: str
    currency: CurrencyEnum
    locale:   LocaleEnum
    
class UserCreate(UserBase):
    password: str

class UserSchema(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    currency: Optional[CurrencyEnum] = None
    locale:   Optional[LocaleEnum] = None

class ChangePasswordRequest(BaseModel):
    new_password: str