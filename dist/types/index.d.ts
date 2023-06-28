import { ApolloLink, NextLink, Operation } from '@apollo/client';
import { TokenRefreshOptions } from './TokenRefreshOptions/TokenRefreshOptions';
export declare class ApolloLinkTokenRefresh extends ApolloLink {
    private safety;
    private beforeRefresh;
    private getAccessToken;
    private refresh;
    private fetching;
    private queue;
    constructor({ safety, getAccessToken, beforeRefresh, refresh }: TokenRefreshOptions);
    request(operation: Operation, forward: NextLink): import("zen-observable-ts").Observable<import("@apollo/client").FetchResult<Record<string, any>, Record<string, any>, Record<string, any>>>;
    private isExpired;
}
