/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** LocaleEnum */
export enum LocaleEnum {
  CsCZ = "cs-CZ",
  DaDK = "da-DK",
  DeAT = "de-AT",
  DeCH = "de-CH",
  DeDE = "de-DE",
  ElGR = "el-GR",
  EnAU = "en-AU",
  EnCA = "en-CA",
  EnGB = "en-GB",
  EnIE = "en-IE",
  EnIN = "en-IN",
  EnNZ = "en-NZ",
  EnUS = "en-US",
  EsAR = "es-AR",
  EsES = "es-ES",
  EsMX = "es-MX",
  FiFI = "fi-FI",
  FrBE = "fr-BE",
  FrCA = "fr-CA",
  FrFR = "fr-FR",
  HiIN = "hi-IN",
  HuHU = "hu-HU",
  IdID = "id-ID",
  ItIT = "it-IT",
  JaJP = "ja-JP",
  KoKR = "ko-KR",
  LtLT = "lt-LT",
  MsMY = "ms-MY",
  NlNL = "nl-NL",
  NoNO = "no-NO",
  PlPL = "pl-PL",
  PtBR = "pt-BR",
  PtPT = "pt-PT",
  RoRO = "ro-RO",
  RuRU = "ru-RU",
  SvSE = "sv-SE",
  ThTH = "th-TH",
  TrTR = "tr-TR",
  ViVN = "vi-VN",
  ZhCN = "zh-CN",
  ZhTW = "zh-TW",
}

/** IncomeCategoryEnum */
export enum IncomeCategoryEnum {
  Salary = "Salary",
  Interests = "Interests",
  Investments = "Investments",
  Rent = "Rent",
  Other = "Other",
}

/** CurrencyEnum */
export enum CurrencyEnum {
  ARS = "ARS",
  AUD = "AUD",
  BRL = "BRL",
  CAD = "CAD",
  CHF = "CHF",
  CNY = "CNY",
  CZK = "CZK",
  DKK = "DKK",
  EUR = "EUR",
  GBP = "GBP",
  HUF = "HUF",
  IDR = "IDR",
  INR = "INR",
  JPY = "JPY",
  KRW = "KRW",
  MXN = "MXN",
  MYR = "MYR",
  NOK = "NOK",
  PLN = "PLN",
  RON = "RON",
  RUB = "RUB",
  SAR = "SAR",
  SEK = "SEK",
  THB = "THB",
  TRY = "TRY",
  TWD = "TWD",
  USD = "USD",
  VND = "VND",
}

/** AggregatedExpensesResponse */
export interface AggregatedExpensesResponse {
  /** Category */
  category: string;
  /** Color */
  color: string;
  /** Total */
  total: number;
  /** Id */
  id: number;
}

/** Body_login_for_access_token_token_post */
export interface BodyLoginForAccessTokenTokenPost {
  /** Grant Type */
  grant_type?: string | null;
  /** Username */
  username: string;
  /** Password */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Client Id */
  client_id?: string | null;
  /** Client Secret */
  client_secret?: string | null;
}

/** BudgetCreate */
export interface BudgetCreate {
  /**
   * Date
   * @format date
   */
  date: string;
  /** Amount */
  amount: number;
}

/** BudgetSchema */
export interface BudgetSchema {
  /**
   * Date
   * @format date
   */
  date: string;
  /** Amount */
  amount: number;
  /** Id */
  id: number;
  /** Owner Id */
  owner_id: number;
}

/** ChangePasswordRequest */
export interface ChangePasswordRequest {
  /** New Password */
  new_password: string;
}

/** ExpenseCategoryCreate */
export interface ExpenseCategoryCreate {
  /** Name */
  name: string;
  /**
   * Color
   * @default "#FFFFFF"
   */
  color?: string;
  /**
   * Icon
   * @default "fas fa-question-circle"
   */
  icon?: string;
}

/** ExpenseCategorySchema */
export interface ExpenseCategorySchema {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Owner Id */
  owner_id: number;
  /** Color */
  color: string;
  /** Icon */
  icon: string;
}

/** ExpenseCreate */
export interface ExpenseCreate {
  /** Description */
  description: string;
  /** Amount */
  amount: number;
  /** Category Id */
  category_id: number;
  /**
   * Date
   * @format date
   */
  date: string;
}

/** ExpenseSchema */
export interface ExpenseSchema {
  /** Id */
  id: number;
  /** Owner Id */
  owner_id: number;
  /** Category Id */
  category_id: number;
  /** Category Name */
  category_name: string;
  /**
   * Date
   * @format date
   */
  date: string;
  /** Description */
  description: string;
  /** Amount */
  amount: number;
  /** Category Icon */
  category_icon: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** IncomeCreate */
export interface IncomeCreate {
  /** Description */
  description: string;
  /** Amount */
  amount: number;
  /**
   * Date
   * @format date
   * @default "2025-07-15"
   */
  date?: string;
  category: IncomeCategoryEnum;
}

/** IncomeSchema */
export interface IncomeSchema {
  /** Id */
  id: number;
  /** Description */
  description: string;
  /** Amount */
  amount: number;
  /** Owner Id */
  owner_id: number;
  /**
   * Date
   * @format date
   */
  date: string;
  category: IncomeCategoryEnum;
}

/** MonthlyAggregate */
export interface MonthlyAggregate {
  /** Month */
  month: number;
  /** Expenses Total */
  expenses_total: number;
  /** Budgets Total */
  budgets_total: number;
  /** Incomes Total */
  incomes_total: number;
  /** Savings Total */
  savings_total: number;
  /** Remaining Budget */
  remaining_budget: number;
}

/** RecurringExpenseCreate */
export interface RecurringExpenseCreate {
  /** Description */
  description: string;
  /** Amount */
  amount: number;
  /** Category Id */
  category_id: number;
  /** Frequency */
  frequency: string;
  /**
   * Next Due Date
   * @format date
   */
  next_due_date: string;
}

/** RecurringExpenseInstance */
export interface RecurringExpenseInstance {
  /** Id */
  id: number;
  /** Description */
  description: string;
  /** Amount */
  amount: number;
  /** Category Name */
  category_name: string;
  /**
   * Date
   * @format date
   */
  date: string;
}

/** RecurringExpenseMonthResponse */
export interface RecurringExpenseMonthResponse {
  /** Instances */
  instances: RecurringExpenseInstance[];
  /** Total Amount */
  total_amount: number;
}

/** RecurringExpenseResponse */
export interface RecurringExpenseResponse {
  /** Description */
  description: string;
  /** Amount */
  amount: number;
  /** Category Id */
  category_id: number;
  /** Frequency */
  frequency: string;
  /**
   * Next Due Date
   * @format date
   */
  next_due_date: string;
  /** Id */
  id: number;
  /** Owner Id */
  owner_id: number;
  /** Category Name */
  category_name: string;
}

/** SavingContributionCreate */
export interface SavingContributionCreate {
  /** Saving Goal Id */
  saving_goal_id: number;
  /** Amount */
  amount: number;
  /**
   * Date
   * @format date
   */
  date: string;
  /** Description */
  description?: string | null;
}

/** SavingContributionRead */
export interface SavingContributionRead {
  /** Saving Goal Id */
  saving_goal_id: number;
  /** Amount */
  amount: number;
  /**
   * Date
   * @format date
   */
  date: string;
  /** Description */
  description?: string | null;
  /** Id */
  id: number;
}

/** SavingGoalCreate */
export interface SavingGoalCreate {
  /** Title */
  title: string;
  /** Target Amount */
  target_amount: number;
  /**
   * Deadline
   * @format date
   */
  deadline: string;
  /**
   * Icon
   * @default "fas fa-question-circle"
   */
  icon?: string;
  /** Owner Id */
  owner_id: number;
}

/** SavingGoalSchema */
export interface SavingGoalSchema {
  /** Title */
  title: string;
  /** Target Amount */
  target_amount: number;
  /**
   * Deadline
   * @format date
   */
  deadline: string;
  /** Id */
  id: number;
  /** Owner Id */
  owner_id: number;
  /** Icon */
  icon: string;
  /** Progress Percent */
  progress_percent: number;
  /** Current Amount */
  current_amount: number;
}

/** UserCreate */
export interface UserCreate {
  /** Username */
  username: string;
  currency: CurrencyEnum;
  locale: LocaleEnum;
  /** Password */
  password: string;
}

/** UserSchema */
export interface UserSchema {
  /** Username */
  username: string;
  currency: CurrencyEnum;
  locale: LocaleEnum;
  /** Id */
  id: number;
}

/** UserUpdate */
export interface UserUpdate {
  currency?: CurrencyEnum | null;
  locale?: LocaleEnum | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title FastAPI
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  token = {
    /**
     * No description
     *
     * @name LoginForAccessTokenTokenPost
     * @summary Login For Access Token
     * @request POST:/token
     * @secure
     */
    loginForAccessTokenTokenPost: (
      data: BodyLoginForAccessTokenTokenPost,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/token`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),
  };
  me = {
    /**
     * No description
     *
     * @name ReadUsersMeMeGet
     * @summary Read Users Me
     * @request GET:/me
     * @secure
     */
    readUsersMeMeGet: (params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  register = {
    /**
     * No description
     *
     * @name RegisterRegisterPost
     * @summary Register
     * @request POST:/register
     * @secure
     */
    registerRegisterPost: (data: UserCreate, params: RequestParams = {}) =>
      this.request<UserSchema, HTTPValidationError>({
        path: `/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  profile = {
    /**
     * No description
     *
     * @name GetProfileProfileGet
     * @summary Get Profile
     * @request GET:/profile
     * @secure
     */
    getProfileProfileGet: (params: RequestParams = {}) =>
      this.request<UserSchema, HTTPValidationError>({
        path: `/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  changePassword = {
    /**
     * No description
     *
     * @name ChangePasswordChangePasswordPost
     * @summary Change Password
     * @request POST:/change-password
     * @secure
     */
    changePasswordChangePasswordPost: (
      data: ChangePasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/change-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  updateProfile = {
    /**
     * No description
     *
     * @name UpdatePreferencesUpdateProfilePatch
     * @summary Update Preferences
     * @request PATCH:/update-profile
     * @secure
     */
    updatePreferencesUpdateProfilePatch: (
      data: UserUpdate,
      params: RequestParams = {},
    ) =>
      this.request<UserSchema, HTTPValidationError>({
        path: `/update-profile`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * No description
     *
     * @name LogoutLogoutPost
     * @summary Logout
     * @request POST:/logout
     * @secure
     */
    logoutLogoutPost: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  aggregateExpenses = {
    /**
     * No description
     *
     * @name AggregateExpensesAggregateExpensesGet
     * @summary Aggregate Expenses
     * @request GET:/aggregate-expenses
     * @secure
     */
    aggregateExpensesAggregateExpensesGet: (
      query: {
        /** Year */
        year: number;
        /** Month */
        month?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<AggregatedExpensesResponse[], HTTPValidationError>({
        path: `/aggregate-expenses`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name AggregateAllByMonthAggregateExpensesAllGet
     * @summary Aggregate All By Month
     * @request GET:/aggregate-expenses/all
     * @secure
     */
    aggregateAllByMonthAggregateExpensesAllGet: (
      query: {
        /** Year */
        year: number;
        /** Month */
        month?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<MonthlyAggregate[], HTTPValidationError>({
        path: `/aggregate-expenses/all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  recurringExpenses = {
    /**
     * No description
     *
     * @tags Recurring Expenses
     * @name GetMonthlyInstancesRecurringExpensesInstancesGet
     * @summary Get Monthly Instances
     * @request GET:/recurring_expenses/instances
     * @secure
     */
    getMonthlyInstancesRecurringExpensesInstancesGet: (
      query?: {
        /**
         * Year
         * @min 2000
         * @default 2025
         */
        year?: number;
        /**
         * Month
         * @min 1
         * @max 12
         * @default 7
         */
        month?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RecurringExpenseMonthResponse, HTTPValidationError>({
        path: `/recurring_expenses/instances`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recurring Expenses
     * @name ReadItemsRecurringExpensesGet
     * @summary Read Items
     * @request GET:/recurring_expenses/
     * @secure
     */
    readItemsRecurringExpensesGet: (
      query?: {
        /**
         * Skip
         * @default 0
         */
        skip?: number;
        /**
         * Limit
         * @default 100
         */
        limit?: number;
        /** Date */
        date?: string | null;
        /** Month */
        month?: number | null;
        /** Year */
        year?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<RecurringExpenseResponse[], HTTPValidationError>({
        path: `/recurring_expenses/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recurring Expenses
     * @name CreateItemRecurringExpensesPost
     * @summary Create Item
     * @request POST:/recurring_expenses/
     * @secure
     */
    createItemRecurringExpensesPost: (
      data: RecurringExpenseCreate,
      params: RequestParams = {},
    ) =>
      this.request<RecurringExpenseResponse, HTTPValidationError>({
        path: `/recurring_expenses/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recurring Expenses
     * @name ReadItemRecurringExpensesItemIdGet
     * @summary Read Item
     * @request GET:/recurring_expenses/{item_id}
     * @secure
     */
    readItemRecurringExpensesItemIdGet: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<RecurringExpenseResponse, HTTPValidationError>({
        path: `/recurring_expenses/${itemId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recurring Expenses
     * @name UpdateItemRecurringExpensesItemIdPut
     * @summary Update Item
     * @request PUT:/recurring_expenses/{item_id}
     * @secure
     */
    updateItemRecurringExpensesItemIdPut: (
      itemId: number,
      data: RecurringExpenseCreate,
      params: RequestParams = {},
    ) =>
      this.request<RecurringExpenseResponse, HTTPValidationError>({
        path: `/recurring_expenses/${itemId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recurring Expenses
     * @name DeleteItemRecurringExpensesItemIdDelete
     * @summary Delete Item
     * @request DELETE:/recurring_expenses/{item_id}
     * @secure
     */
    deleteItemRecurringExpensesItemIdDelete: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<object, void | HTTPValidationError>({
        path: `/recurring_expenses/${itemId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  budget = {
    /**
     * No description
     *
     * @tags Budget
     * @name ReadItemsBudgetGet
     * @summary Read Items
     * @request GET:/budget/
     * @secure
     */
    readItemsBudgetGet: (
      query?: {
        /**
         * Skip
         * @default 0
         */
        skip?: number;
        /**
         * Limit
         * @default 100
         */
        limit?: number;
        /** Date */
        date?: string | null;
        /** Month */
        month?: number | null;
        /** Year */
        year?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<BudgetSchema[], HTTPValidationError>({
        path: `/budget/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Budget
     * @name CreateItemBudgetPost
     * @summary Create Item
     * @request POST:/budget/
     * @secure
     */
    createItemBudgetPost: (data: BudgetCreate, params: RequestParams = {}) =>
      this.request<BudgetSchema, HTTPValidationError>({
        path: `/budget/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Budget
     * @name ReadItemBudgetItemIdGet
     * @summary Read Item
     * @request GET:/budget/{item_id}
     * @secure
     */
    readItemBudgetItemIdGet: (itemId: number, params: RequestParams = {}) =>
      this.request<BudgetSchema, HTTPValidationError>({
        path: `/budget/${itemId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Budget
     * @name UpdateItemBudgetItemIdPut
     * @summary Update Item
     * @request PUT:/budget/{item_id}
     * @secure
     */
    updateItemBudgetItemIdPut: (
      itemId: number,
      data: BudgetCreate,
      params: RequestParams = {},
    ) =>
      this.request<BudgetSchema, HTTPValidationError>({
        path: `/budget/${itemId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Budget
     * @name DeleteItemBudgetItemIdDelete
     * @summary Delete Item
     * @request DELETE:/budget/{item_id}
     * @secure
     */
    deleteItemBudgetItemIdDelete: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<object, void | HTTPValidationError>({
        path: `/budget/${itemId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  expenseCategories = {
    /**
     * No description
     *
     * @tags Expense Categories
     * @name ReadItemsExpenseCategoriesGet
     * @summary Read Items
     * @request GET:/expense_categories/
     * @secure
     */
    readItemsExpenseCategoriesGet: (
      query?: {
        /**
         * Skip
         * @default 0
         */
        skip?: number;
        /**
         * Limit
         * @default 100
         */
        limit?: number;
        /** Date */
        date?: string | null;
        /** Month */
        month?: number | null;
        /** Year */
        year?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<ExpenseCategorySchema[], HTTPValidationError>({
        path: `/expense_categories/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Expense Categories
     * @name CreateItemExpenseCategoriesPost
     * @summary Create Item
     * @request POST:/expense_categories/
     * @secure
     */
    createItemExpenseCategoriesPost: (
      data: ExpenseCategoryCreate,
      params: RequestParams = {},
    ) =>
      this.request<ExpenseCategorySchema, HTTPValidationError>({
        path: `/expense_categories/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Expense Categories
     * @name ReadItemExpenseCategoriesItemIdGet
     * @summary Read Item
     * @request GET:/expense_categories/{item_id}
     * @secure
     */
    readItemExpenseCategoriesItemIdGet: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<ExpenseCategorySchema, HTTPValidationError>({
        path: `/expense_categories/${itemId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Expense Categories
     * @name UpdateItemExpenseCategoriesItemIdPut
     * @summary Update Item
     * @request PUT:/expense_categories/{item_id}
     * @secure
     */
    updateItemExpenseCategoriesItemIdPut: (
      itemId: number,
      data: ExpenseCategoryCreate,
      params: RequestParams = {},
    ) =>
      this.request<ExpenseCategorySchema, HTTPValidationError>({
        path: `/expense_categories/${itemId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Expense Categories
     * @name DeleteItemExpenseCategoriesItemIdDelete
     * @summary Delete Item
     * @request DELETE:/expense_categories/{item_id}
     * @secure
     */
    deleteItemExpenseCategoriesItemIdDelete: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<object, void | HTTPValidationError>({
        path: `/expense_categories/${itemId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  income = {
    /**
     * No description
     *
     * @tags Income
     * @name ReadItemsIncomeGet
     * @summary Read Items
     * @request GET:/income/
     * @secure
     */
    readItemsIncomeGet: (
      query?: {
        /**
         * Skip
         * @default 0
         */
        skip?: number;
        /**
         * Limit
         * @default 100
         */
        limit?: number;
        /** Date */
        date?: string | null;
        /** Month */
        month?: number | null;
        /** Year */
        year?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<IncomeSchema[], HTTPValidationError>({
        path: `/income/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Income
     * @name CreateItemIncomePost
     * @summary Create Item
     * @request POST:/income/
     * @secure
     */
    createItemIncomePost: (data: IncomeCreate, params: RequestParams = {}) =>
      this.request<IncomeSchema, HTTPValidationError>({
        path: `/income/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Income
     * @name ReadItemIncomeItemIdGet
     * @summary Read Item
     * @request GET:/income/{item_id}
     * @secure
     */
    readItemIncomeItemIdGet: (itemId: number, params: RequestParams = {}) =>
      this.request<IncomeSchema, HTTPValidationError>({
        path: `/income/${itemId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Income
     * @name UpdateItemIncomeItemIdPut
     * @summary Update Item
     * @request PUT:/income/{item_id}
     * @secure
     */
    updateItemIncomeItemIdPut: (
      itemId: number,
      data: IncomeCreate,
      params: RequestParams = {},
    ) =>
      this.request<IncomeSchema, HTTPValidationError>({
        path: `/income/${itemId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Income
     * @name DeleteItemIncomeItemIdDelete
     * @summary Delete Item
     * @request DELETE:/income/{item_id}
     * @secure
     */
    deleteItemIncomeItemIdDelete: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<object, void | HTTPValidationError>({
        path: `/income/${itemId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  expenses = {
    /**
     * No description
     *
     * @tags Expenses
     * @name ReadItemsExpensesGet
     * @summary Read Items
     * @request GET:/expenses/
     * @secure
     */
    readItemsExpensesGet: (
      query?: {
        /**
         * Skip
         * @default 0
         */
        skip?: number;
        /**
         * Limit
         * @default 100
         */
        limit?: number;
        /** Date */
        date?: string | null;
        /** Month */
        month?: number | null;
        /** Year */
        year?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<ExpenseSchema[], HTTPValidationError>({
        path: `/expenses/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Expenses
     * @name CreateItemExpensesPost
     * @summary Create Item
     * @request POST:/expenses/
     * @secure
     */
    createItemExpensesPost: (data: ExpenseCreate, params: RequestParams = {}) =>
      this.request<ExpenseSchema, HTTPValidationError>({
        path: `/expenses/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Expenses
     * @name ReadItemExpensesItemIdGet
     * @summary Read Item
     * @request GET:/expenses/{item_id}
     * @secure
     */
    readItemExpensesItemIdGet: (itemId: number, params: RequestParams = {}) =>
      this.request<ExpenseSchema, HTTPValidationError>({
        path: `/expenses/${itemId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Expenses
     * @name UpdateItemExpensesItemIdPut
     * @summary Update Item
     * @request PUT:/expenses/{item_id}
     * @secure
     */
    updateItemExpensesItemIdPut: (
      itemId: number,
      data: ExpenseCreate,
      params: RequestParams = {},
    ) =>
      this.request<ExpenseSchema, HTTPValidationError>({
        path: `/expenses/${itemId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Expenses
     * @name DeleteItemExpensesItemIdDelete
     * @summary Delete Item
     * @request DELETE:/expenses/{item_id}
     * @secure
     */
    deleteItemExpensesItemIdDelete: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<object, void | HTTPValidationError>({
        path: `/expenses/${itemId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  savings = {
    /**
     * No description
     *
     * @tags Saving Goals
     * @name ReadItemsSavingsGet
     * @summary Read Items
     * @request GET:/savings/
     * @secure
     */
    readItemsSavingsGet: (
      query?: {
        /**
         * Skip
         * @default 0
         */
        skip?: number;
        /**
         * Limit
         * @default 100
         */
        limit?: number;
        /** Date */
        date?: string | null;
        /** Month */
        month?: number | null;
        /** Year */
        year?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<SavingGoalSchema[], HTTPValidationError>({
        path: `/savings/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Saving Goals
     * @name CreateItemSavingsPost
     * @summary Create Item
     * @request POST:/savings/
     * @secure
     */
    createItemSavingsPost: (
      data: SavingGoalCreate,
      params: RequestParams = {},
    ) =>
      this.request<SavingGoalSchema, HTTPValidationError>({
        path: `/savings/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Saving Goals
     * @name ReadItemSavingsItemIdGet
     * @summary Read Item
     * @request GET:/savings/{item_id}
     * @secure
     */
    readItemSavingsItemIdGet: (itemId: number, params: RequestParams = {}) =>
      this.request<SavingGoalSchema, HTTPValidationError>({
        path: `/savings/${itemId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Saving Goals
     * @name UpdateItemSavingsItemIdPut
     * @summary Update Item
     * @request PUT:/savings/{item_id}
     * @secure
     */
    updateItemSavingsItemIdPut: (
      itemId: number,
      data: SavingGoalCreate,
      params: RequestParams = {},
    ) =>
      this.request<SavingGoalSchema, HTTPValidationError>({
        path: `/savings/${itemId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Saving Goals
     * @name DeleteItemSavingsItemIdDelete
     * @summary Delete Item
     * @request DELETE:/savings/{item_id}
     * @secure
     */
    deleteItemSavingsItemIdDelete: (
      itemId: number,
      params: RequestParams = {},
    ) =>
      this.request<object, void | HTTPValidationError>({
        path: `/savings/${itemId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  deposit = {
    /**
     * No description
     *
     * @name DepositToGoalDepositGoalIdPost
     * @summary Deposit To Goal
     * @request POST:/deposit/{goal_id}
     * @secure
     */
    depositToGoalDepositGoalIdPost: (
      goalId: number,
      data: SavingContributionCreate,
      params: RequestParams = {},
    ) =>
      this.request<SavingContributionRead, HTTPValidationError>({
        path: `/deposit/${goalId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
