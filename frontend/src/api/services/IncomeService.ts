/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IncomeCreate } from '../models/IncomeCreate';
import type { IncomeSchema } from '../models/IncomeSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IncomeService {
    /**
     * Read Items
     * @param skip
     * @param limit
     * @param date
     * @param month
     * @param year
     * @param accessToken
     * @returns IncomeSchema Successful Response
     * @throws ApiError
     */
    public static readItemsIncomeGet(
        skip?: number,
        limit: number = 100,
        date?: (string | null),
        month?: (number | null),
        year?: (number | null),
        accessToken?: string,
    ): CancelablePromise<Array<IncomeSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/income/',
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
     * @returns IncomeSchema Successful Response
     * @throws ApiError
     */
    public static createItemIncomePost(
        requestBody: IncomeCreate,
        accessToken?: string,
    ): CancelablePromise<IncomeSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/income/',
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
     * @returns IncomeSchema Successful Response
     * @throws ApiError
     */
    public static readItemIncomeItemIdGet(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<IncomeSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/income/{item_id}',
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
     * @returns IncomeSchema Successful Response
     * @throws ApiError
     */
    public static updateItemIncomeItemIdPut(
        itemId: number,
        requestBody: IncomeCreate,
        accessToken?: string,
    ): CancelablePromise<IncomeSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/income/{item_id}',
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
    public static deleteItemIncomeItemIdDelete(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/income/{item_id}',
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
