import { FetchResult, NextLink, Observable, Operation } from '@apollo/client';
interface Subscriber {
    next?: (result: FetchResult) => void;
    error?: (error: Error) => void;
    complete?: () => void;
}
export interface OperationQueueRequest {
    operation: Operation;
    subscriber?: Subscriber;
    observable?: Observable<FetchResult>;
    forward?: NextLink;
    next?: (result: FetchResult) => void;
    error?: (error: Error) => void;
    complete?: () => void;
}
export {};
