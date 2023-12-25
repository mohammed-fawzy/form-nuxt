import type { UseFetchOptions } from '#app'
import { defu } from 'defu'

export function useCustomFetch<T> (url: string | (() => string), options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.BASE_URL,
    // this overrides the default key generation, which includes a hash of
    // url, method, headers, etc. - this should be used with care as the key
    // is how Nuxt decides how responses should be deduplicated between
    // client and server

    // set user token if connected
    headers: {
      'private-key': '3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16'
    },

    onResponse (_ctx) {
      // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
    },

    onResponseError (_ctx) {
      // throw new myBusinessError()
    }
  }
  // options.baseURL = config.public.BASE_URL
  // for nice deep defaults, please use unjs/defu
  const params = defu(options, defaults)

  return useFetch(url, params)
}
