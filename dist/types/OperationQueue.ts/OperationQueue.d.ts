import { FetchResult, Observable } from '@apollo/client';
import { OperationQueueRequest } from './OperationQueueRequest';
export declare class OperationQueue {
    queue: OperationQueueRequest[];
    constructor();
    private createObservable;
    enqueueRequest(request: OperationQueueRequest): Observable<FetchResult>;
    consumeQueue(): void;
}
