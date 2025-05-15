/* import baseUrl from '@/services/api' */
export function useImageUrl(path: string): string {
  const baseUrl = 'http://localhost:8000/storage/'
  return new URL(path, baseUrl).toString()
}
