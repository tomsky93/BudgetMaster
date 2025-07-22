/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AggregatedExpensesResponse } from '../models/AggregatedExpensesResponse';
import type { Body_login_for_access_token_token_post } from '../models/Body_login_for_access_token_token_post';
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { MonthlyAggregate } from '../models/MonthlyAggregate';
import type { SavingContributionCreate } from '../models/SavingContributionCreate';
import type { SavingContributionRead } from '../models/SavingContributionRead';
import type { UserCreate } from '../models/UserCreate';
import type { UserSchema } from '../models/UserSchema';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Login For Access Token
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static loginForAccessTokenTokenPost(
        formData: Body_login_for_access_token_token_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/token',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Users Me
     * @param accessToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readUsersMeMeGet(
        accessToken?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me',
            cookies: {
                'access_token': accessToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Register
     * @param requestBody
     * @returns UserSchema Successful Response
     * @throws ApiError
     */
    public static registerRegisterPost(
        requestBody: UserCreate,
    ): CancelablePromise<UserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Profile
     * @param accessToken
     * @returns UserSchema Successful Response
     * @throws ApiError
     */
    public static getProfileProfileGet(
        accessToken?: string,
    ): CancelablePromise<UserSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile',
            cookies: {
                'access_token': accessToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Change Password
     * @param requestBody
     * @param accessToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static changePasswordChangePasswordPost(
        requestBody: ChangePasswordRequest,
        accessToken?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/change-password',
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
     * Update Preferences
     * @param requestBody
     * @param accessToken
     * @returns UserSchema Successful Response
     * @throws ApiError
     */
    public static updatePreferencesUpdateProfilePatch(
        requestBody: UserUpdate,
        accessToken?: string,
    ): CancelablePromise<UserSchema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/update-profile',
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
     * Logout
     * @returns any Successful Response
     * @throws ApiError
     */
    public static logoutLogoutPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/logout',
        });
    }
    /**
     * Aggregate Expenses
     * @param year
     * @param month
     * @param accessToken
     * @returns AggregatedExpensesResponse Successful Response
     * @throws ApiError
     */
    public static aggregateExpensesAggregateExpensesGet(
        year: number,
        month?: (number | null),
        accessToken?: string,
    ): CancelablePromise<Array<AggregatedExpensesResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/aggregate-expenses',
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
     * Aggregate All By Month
     * @param year
     * @param month
     * @param accessToken
     * @returns MonthlyAggregate Successful Response
     * @throws ApiError
     */
    public static aggregateAllByMonthAggregateExpensesAllGet(
        year: number,
        month?: (number | null),
        accessToken?: string,
    ): CancelablePromise<Array<MonthlyAggregate>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/aggregate-expenses/all',
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
     * Deposit To Goal
     * @param goalId
     * @param requestBody
     * @param accessToken
     * @returns SavingContributionRead Successful Response
     * @throws ApiError
     */
    public static depositToGoalDepositGoalIdPost(
        goalId: number,
        requestBody: SavingContributionCreate,
        accessToken?: string,
    ): CancelablePromise<SavingContributionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deposit/{goal_id}',
            path: {
                'goal_id': goalId,
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
}
