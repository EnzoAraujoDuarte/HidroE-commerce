import { CommerceError } from './provider'

const MOCK_SHOP_ENDPOINT = 'https://mock.shop/api'
const DEFAULT_TIMEOUT_MS = Number.parseInt(
  process.env.COMMERCE_FETCH_TIMEOUT_MS ?? '8000',
  10
)
const DEFAULT_RETRIES = Number.parseInt(
  process.env.COMMERCE_FETCH_RETRIES ?? '1',
  10
)

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

export async function commerceFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { cache?: RequestCache; revalidate?: number }
): Promise<T> {
  const endpoint = process.env.SHOPIFY_STOREFRONT_ENDPOINT || MOCK_SHOP_ENDPOINT
  const timeoutMs = Number.isFinite(DEFAULT_TIMEOUT_MS) ? DEFAULT_TIMEOUT_MS : 8000
  const retries = Number.isFinite(DEFAULT_RETRIES) ? DEFAULT_RETRIES : 1

  let lastError: CommerceError | null = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.SHOPIFY_STOREFRONT_TOKEN && {
            'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN,
          }),
        },
        body: JSON.stringify({ query, variables }),
        cache: options?.cache,
        next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new CommerceError(`HTTP error: ${response.status}`, 'NETWORK')
      }

      const json: GraphQLResponse<T> = await response.json()

      if (json.errors?.length) {
        const message = json.errors[0].message
        const code = message.includes('not found')
          ? 'NOT_FOUND'
          : message.includes('invalid')
            ? 'INVALID_QUERY'
            : 'UNKNOWN'
        throw new CommerceError(message, code)
      }

      if (!json.data) {
        throw new CommerceError('No data returned', 'UNKNOWN')
      }

      return json.data
    } catch (error) {
      if (error instanceof CommerceError && error.code !== 'NETWORK') {
        throw error
      }

      const message =
        error instanceof CommerceError
          ? error.message
          : error instanceof Error && error.name === 'AbortError'
            ? `Request timed out after ${timeoutMs}ms`
            : error instanceof Error
              ? error.message
              : 'Unknown error'

      lastError = new CommerceError(`${message} (${endpoint})`, 'NETWORK')

      if (attempt === retries) {
        throw lastError
      }
    } finally {
      clearTimeout(timeout)
    }
  }

  throw lastError ?? new CommerceError(`Unable to reach commerce endpoint (${endpoint})`, 'NETWORK')
}
