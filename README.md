### Apollo Refresh Link

```ts
export const apolloLinkRefresh = new ApolloLinkTokenRefresh({
  safety: 60,
  getAccessToken: () => login.accessToken.get(),
  beforeRefresh: () => null,
  refresh: ({ onSuccess, onError, onFinally }) => {
    login.refresh({
      onError,
      onFinally,
      onSuccess: () => {
        login.setAccessToken(accessToken)
        login.setRefreshToken(refreshToken)
        onSuccess && onSuccess()
      },
    })
  },
})
```

### Creating Apollo Link

<!-- prettier-ignore -->
```ts
const apolloLinks = ApolloLink.from([
  apolloLinkRefresh, 
  apolloLinkRequest,
  apolloLinkHTTP
]) 
```

### `ApolloLinkTokenRefreshOptions`

| Property         | Type                     | Note                                                         |
| ---------------- | ------------------------ | ------------------------------------------------------------ |
| `safety`         | _seconds_ `number`       | A safety time so that AccessToken does not expire on the fly |
| `getAccessToken` | `() => string`           | A method returning current AccessToken                       |
| `beforeRefresh`  | `() => void`             | This method will be called before refreshing AccessToken     |
| `refresh`        | `(RefreshProps) => void` | `refresh()` method and it's handlers                         |

```ts
interface RefreshProps {
  onSuccess: () => void
  onError: () => void
  onFinally: () => void
}
```
