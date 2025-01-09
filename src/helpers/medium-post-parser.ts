/**
 * Extracts the image from the response of the `use-medium-posts` hook
 *
 * @param response Response from `use-medium-posts` hook}
 */
export function extractImg(response: string): string | null {
  const regex = /src\s*=\s*"(.+?)"/
  const match = response.match(regex)
  return match && match[1]
}
