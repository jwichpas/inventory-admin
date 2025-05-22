/* import baseUrl from '@/services/api' */
export function useImageUrl(path: string): string {
  const baseUrl = 'http://192.168.18.21:8000/storage/'
  return new URL(path, baseUrl).toString()
}
