import { FetchResult, Observable } from '@apollo/client'
import { OperationQueueRequest } from './OperationQueueRequest'

export class OperationQueue {
  public queue: OperationQueueRequest[] = []
  constructor() {
    this.queue = []
  }

  private createObservable(req: OperationQueueRequest) {
    return new Observable<FetchResult>(observer => {
      this.queue.push(req)

      if (typeof req.subscriber === 'undefined') req.subscriber = {}
      req.subscriber.next = req.next || observer.next.bind(observer)
      req.subscriber.error = req.error || observer.error.bind(observer)
      req.subscriber.complete = req.complete || observer.complete.bind(observer)
    })
  }

  public enqueueRequest(request: OperationQueueRequest): Observable<FetchResult> {
    const req = { ...request }
    req.observable = req.observable || this.createObservable(req)
    return req.observable
  }

  public consumeQueue() {
    this.queue.forEach(req => req.forward!(req.operation).subscribe(req.subscriber!))
    this.queue = []
  }
}
