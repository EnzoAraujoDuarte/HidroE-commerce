import { CommerceError } from './provider'

export interface CommerceResult<T> {
  data: T | null
  error: CommerceError | null
}

export async function resolveCommerce<T>(
  operation: () => Promise<T>
): Promise<CommerceResult<T>> {
  try {
    const data = await operation()
    return { data, error: null }
  } catch (error) {
    if (error instanceof CommerceError) {
      return { data: null, error }
    }

    throw error
  }
}
