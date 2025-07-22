/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BudgetCreate } from '../models/BudgetCreate';
import type { BudgetSchema } from '../models/BudgetSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BudgetService {
    /**
     * Read Items
     * @param skip
     * @param limit
     * @param date
     * @param month
     * @param year
     * @param accessToken
     * @returns BudgetSchema Successful Response
     * @throws ApiError
     */
    public static readItemsBudgetGet(
        skip?: number,
        limit: number = 100,
        date?: (string | null),
        month?: (number | null),
        year?: (number | null),
        accessToken?: string,
    ): CancelablePromise<Array<BudgetSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/budget/',
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
     * @returns BudgetSchema Successful Response
     * @throws ApiError
     */
    public static createItemBudgetPost(
        requestBody: BudgetCreate,
        accessToken?: string,
    ): CancelablePromise<BudgetSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/budget/',
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
     * @returns BudgetSchema Successful Response
     * @throws ApiError
     */
    public static readItemBudgetItemIdGet(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<BudgetSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/budget/{item_id}',
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
     * @returns BudgetSchema Successful Response
     * @throws ApiError
     */
    public static updateItemBudgetItemIdPut(
        itemId: number,
        requestBody: BudgetCreate,
        accessToken?: string,
    ): CancelablePromise<BudgetSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/budget/{item_id}',
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
    public static deleteItemBudgetItemIdDelete(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/budget/{item_id}',
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
