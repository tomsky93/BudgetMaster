/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecurringExpenseCreate } from '../models/RecurringExpenseCreate';
import type { RecurringExpenseMonthResponse } from '../models/RecurringExpenseMonthResponse';
import type { RecurringExpenseResponse } from '../models/RecurringExpenseResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RecurringExpensesService {
    /**
     * Get Monthly Instances
     * @param year
     * @param month
     * @param accessToken
     * @returns RecurringExpenseMonthResponse Successful Response
     * @throws ApiError
     */
    public static getMonthlyInstancesRecurringExpensesInstancesGet(
        year: number = 2025,
        month: number = 7,
        accessToken?: string,
    ): CancelablePromise<RecurringExpenseMonthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recurring_expenses/instances',
            cookies: {
                'access_token': accessToken,
            },
            query: {
                'year': year,
                'month': month,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Items
     * @param skip
     * @param limit
     * @param date
     * @param month
     * @param year
     * @param accessToken
     * @returns RecurringExpenseResponse Successful Response
     * @throws ApiError
     */
    public static readItemsRecurringExpensesGet(
        skip?: number,
        limit: number = 100,
        date?: (string | null),
        month?: (number | null),
        year?: (number | null),
        accessToken?: string,
    ): CancelablePromise<Array<RecurringExpenseResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recurring_expenses/',
            cookies: {
                'access_token': accessToken,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'date': date,
                'month': month,
                'year': year,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Item
     * @param requestBody
     * @param accessToken
     * @returns RecurringExpenseResponse Successful Response
     * @throws ApiError
     */
    public static createItemRecurringExpensesPost(
        requestBody: RecurringExpenseCreate,
        accessToken?: string,
    ): CancelablePromise<RecurringExpenseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/recurring_expenses/',
            cookies: {
                'access_token': accessToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Item
     * @param itemId
     * @param accessToken
     * @returns RecurringExpenseResponse Successful Response
     * @throws ApiError
     */
    public static readItemRecurringExpensesItemIdGet(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<RecurringExpenseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recurring_expenses/{item_id}',
            path: {
                'item_id': itemId,
            },
            cookies: {
                'access_token': accessToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Item
     * @param itemId
     * @param requestBody
     * @param accessToken
     * @returns RecurringExpenseResponse Successful Response
     * @throws ApiError
     */
    public static updateItemRecurringExpensesItemIdPut(
        itemId: number,
        requestBody: RecurringExpenseCreate,
        accessToken?: string,
    ): CancelablePromise<RecurringExpenseResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/recurring_expenses/{item_id}',
            path: {
                'item_id': itemId,
            },
            cookies: {
                'access_token': accessToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Item
     * @param itemId
     * @param accessToken
     * @returns any Item was successfully deleted
     * @throws ApiError
     */
    public static deleteItemRecurringExpensesItemIdDelete(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/recurring_expenses/{item_id}',
            path: {
                'item_id': itemId,
            },
            cookies: {
                'access_token': accessToken,
            },
            errors: {
                404: `Item not found`,
                422: `Validation Error`,
            },
        });
    }
}
