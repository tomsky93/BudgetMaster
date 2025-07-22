/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SavingGoalCreate } from '../models/SavingGoalCreate';
import type { SavingGoalSchema } from '../models/SavingGoalSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SavingGoalsService {
    /**
     * Read Items
     * @param skip
     * @param limit
     * @param date
     * @param month
     * @param year
     * @param accessToken
     * @returns SavingGoalSchema Successful Response
     * @throws ApiError
     */
    public static readItemsSavingsGet(
        skip?: number,
        limit: number = 100,
        date?: (string | null),
        month?: (number | null),
        year?: (number | null),
        accessToken?: string,
    ): CancelablePromise<Array<SavingGoalSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/savings/',
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
     * @returns SavingGoalSchema Successful Response
     * @throws ApiError
     */
    public static createItemSavingsPost(
        requestBody: SavingGoalCreate,
        accessToken?: string,
    ): CancelablePromise<SavingGoalSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/savings/',
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
     * @returns SavingGoalSchema Successful Response
     * @throws ApiError
     */
    public static readItemSavingsItemIdGet(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<SavingGoalSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/savings/{item_id}',
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
     * @returns SavingGoalSchema Successful Response
     * @throws ApiError
     */
    public static updateItemSavingsItemIdPut(
        itemId: number,
        requestBody: SavingGoalCreate,
        accessToken?: string,
    ): CancelablePromise<SavingGoalSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/savings/{item_id}',
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
    public static deleteItemSavingsItemIdDelete(
        itemId: number,
        accessToken?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/savings/{item_id}',
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
