import { CurrencyEnum, LocaleEnum } from "../api/api";

export const LocaleLabels: Record<LocaleEnum, string> = {
  [LocaleEnum.CsCZ]: "Čeština (Česká republika)",
  [LocaleEnum.DaDK]: "Dansk (Danmark)",
  [LocaleEnum.DeAT]: "Deutsch (Österreich)",
  [LocaleEnum.DeCH]: "Deutsch (Schweiz)",
  [LocaleEnum.DeDE]: "Deutsch (Deutschland)",
  [LocaleEnum.ElGR]: "Ελληνικά (Ελλάδα)",
  [LocaleEnum.EnAU]: "English (Australia)",
  [LocaleEnum.EnCA]: "English (Canada)",
  [LocaleEnum.EnGB]: "English (UK)",
  [LocaleEnum.EnIE]: "English (Ireland)",
  [LocaleEnum.EnIN]: "English (India)",
  [LocaleEnum.EnNZ]: "English (New Zealand)",
  [LocaleEnum.EnUS]: "English (United States)",
  [LocaleEnum.EsAR]: "Español (Argentina)",
  [LocaleEnum.EsES]: "Español (España)",
  [LocaleEnum.EsMX]: "Español (México)",
  [LocaleEnum.FiFI]: "Suomi (Suomi)",
  [LocaleEnum.FrBE]: "Français (Belgique)",
  [LocaleEnum.FrCA]: "Français (Canada)",
  [LocaleEnum.FrFR]: "Français (France)",
  [LocaleEnum.HiIN]: "हिन्दी (भारत)",
  [LocaleEnum.HuHU]: "Magyar (Magyarország)",
  [LocaleEnum.IdID]: "Bahasa Indonesia (Indonesia)",
  [LocaleEnum.ItIT]: "Italiano (Italia)",
  [LocaleEnum.JaJP]: "日本語 (日本)",
  [LocaleEnum.KoKR]: "한국어 (대한민국)",
  [LocaleEnum.LtLT]: "Lietuvių (Lietuva)",
  [LocaleEnum.MsMY]: "Bahasa Melayu (Malaysia)",
  [LocaleEnum.NlNL]: "Nederlands (Nederland)",
  [LocaleEnum.NoNO]: "Norsk (Norge)",
  [LocaleEnum.PlPL]: "Polski (Polska)",
  [LocaleEnum.PtBR]: "Português (Brasil)",
  [LocaleEnum.PtPT]: "Português (Portugal)",
  [LocaleEnum.RoRO]: "Română (România)",
  [LocaleEnum.RuRU]: "Русский (Россия)",
  [LocaleEnum.SvSE]: "Svenska (Sverige)",
  [LocaleEnum.ThTH]: "ไทย (ประเทศไทย)",
  [LocaleEnum.TrTR]: "Türkçe (Türkiye)",
  [LocaleEnum.ViVN]: "Tiếng Việt (Việt Nam)",
  [LocaleEnum.ZhCN]: "简体中文 (中国)",
  [LocaleEnum.ZhTW]: "繁體中文 (台灣)",
};


export const localeOptions = Object.entries(LocaleLabels).map(
  ([value, label]) => ({
    label,
    value: value as LocaleEnum,
  })
);

export const currencyOptions = Object.values(CurrencyEnum).map((c) => ({
  label: c,
  value: c,
}));