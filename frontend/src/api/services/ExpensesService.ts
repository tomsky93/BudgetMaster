/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseCreate } from '../models/ExpenseCreate';
import type { ExpenseSchema } from '../models/ExpenseSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExpensesService {
    /**
     * Read Items
     * @param skip
     * @param limit
     * @param date
     * @param month
     * @param year
     * @param accessToken
     * @returns ExpenseSchema Successful Response
     * @throws ApiError
     */
    public static readItemsExpensesGet(
        skip?: number,
        limit: number = 100,
        date?: (string | null),
        month?: (number | null),
        year?: (number | null),
        accessToken?: string,
    ): CancelablePromise<Array<ExpenseSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/expenses/',
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
     * @returns ExpenseSchema Successful Response
     * @throws ApiError
     */
    public static createItemExpensesPost(
        requestBody: ExpenseCreate,
        accessToken?: string,
    ): CancelablePromise<ExpenseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/expenses/',
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
     * @returns ExpenseSchema Successful Response
     * @throws ApiError
     */
    public static readItemExpensesItemIdGet(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<ExpenseSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/expenses/{item_id}',
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
     * @returns ExpenseSchema Successful Response
     * @throws ApiError
     */
    public static updateItemExpensesItemIdPut(
        itemId: number,
        requestBody: ExpenseCreate,
        accessToken?: string,
    ): CancelablePromise<ExpenseSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/expenses/{item_id}',
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
    public static deleteItemExpensesItemIdDelete(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/expenses/{item_id}',
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
