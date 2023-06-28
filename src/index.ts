import { ApolloLink, NextLink, Operation } from '@apollo/client'
import JwtDecode, { JwtPayload } from 'jwt-decode'
import { OperationQueue } from './OperationQueue.ts/OperationQueue'
import { RefreshFunc, TokenRefreshOptions } from './TokenRefreshOptions/TokenRefreshOptions'

export class ApolloLinkTokenRefresh extends ApolloLink {
  private safety: number = 60
  private beforeRefresh: () => void = () => null
  private getAccessToken: () => string
  private refresh: RefreshFunc
  private fetching = false
  private queue = new OperationQueue()

  constructor({ safety, getAccessToken, beforeRefresh, refresh }: TokenRefreshOptions) {
    super()
    if (safety) this.safety = safety
    if (beforeRefresh) this.beforeRefresh = beforeRefresh
    this.getAccessToken = getAccessToken
    this.refresh = refresh
  }

  public request(operation: Operation, forward: NextLink) {
    if (!this.isExpired()) return forward(operation)
    if (!this.fetching) {
      this.fetching = true
      this.beforeRefresh()
      this.refresh({
        onFinally: () => {
          this.fetching = false
          this.queue.consumeQueue()
        },
      })
    }
    return this.queue.enqueueRequest({ operation, forward })
  }

  private isExpired() {
    const accessToken = this.getAccessToken()
    if (!accessToken) return false
    try {
      const exp = (JwtDecode<JwtPayload>(accessToken).exp || 0) - this.safety
      return Date.now() >= exp * 1000
    } catch {
      return true
    }
  }
}
