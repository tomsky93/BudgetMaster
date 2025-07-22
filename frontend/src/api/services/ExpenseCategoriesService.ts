/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseCategoryCreate } from '../models/ExpenseCategoryCreate';
import type { ExpenseCategorySchema } from '../models/ExpenseCategorySchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExpenseCategoriesService {
    /**
     * Read Items
     * @param skip
     * @param limit
     * @param date
     * @param month
     * @param year
     * @param accessToken
     * @returns ExpenseCategorySchema Successful Response
     * @throws ApiError
     */
    public static readItemsExpenseCategoriesGet(
        skip?: number,
        limit: number = 100,
        date?: (string | null),
        month?: (number | null),
        year?: (number | null),
        accessToken?: string,
    ): CancelablePromise<Array<ExpenseCategorySchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/expense_categories/',
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
     * @returns ExpenseCategorySchema Successful Response
     * @throws ApiError
     */
    public static createItemExpenseCategoriesPost(
        requestBody: ExpenseCategoryCreate,
        accessToken?: string,
    ): CancelablePromise<ExpenseCategorySchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/expense_categories/',
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
     * @returns ExpenseCategorySchema Successful Response
     * @throws ApiError
     */
    public static readItemExpenseCategoriesItemIdGet(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<ExpenseCategorySchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/expense_categories/{item_id}',
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
     * @returns ExpenseCategorySchema Successful Response
     * @throws ApiError
     */
    public static updateItemExpenseCategoriesItemIdPut(
        itemId: number,
        requestBody: ExpenseCategoryCreate,
        accessToken?: string,
    ): CancelablePromise<ExpenseCategorySchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/expense_categories/{item_id}',
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
    public static deleteItemExpenseCategoriesItemIdDelete(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/expense_categories/{item_id}',
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
