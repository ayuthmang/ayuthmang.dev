import axios from 'axios'
import type { RssToJsonMediumResponse } from './use-medium.types'
import { useSuspenseQuery } from '@tanstack/react-query'

const rssToJsonUrl =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/{username}'

export async function getLatestMediumPosts(username: string) {
  const response = await axios.get<RssToJsonMediumResponse>(
    rssToJsonUrl.replace('{username}', username),
  )
  const responseData = response.data
  responseData.items = response.data.items.map((item) => {
    return {
      ...item,
      thumbnail: extractImg(item.content) || '',
    }
  })
  return responseData
}

export function useLatestMediumPosts(username: string) {
  const postsQuery = useSuspenseQuery({
    queryKey: ['medium', username],
    queryFn: () => getLatestMediumPosts(username),
    staleTime: 60 * 60 * 1000, // 1 hrs
  })

  return postsQuery
}
/**
 * Extracts the image from the response of the `use-medium-posts` hook
 *
 * @param response Response from `use-medium-posts` hook}
 */
export function extractImg(response: string): string | null {
  const regex = /<img[^>]*src\s*=\s*["']([^"']+)["']/i
  const match = response.match(regex)
  return match && match[1]
}

/**
 * Derives a URL-safe slug from a Medium article link.
 * Medium links follow the pattern:
 *   https://medium.com/@username/article-title-abc123
 * The last path segment is used as the slug.
 */
export function slugFromLink(link: string): string {
  return link.split('/').filter(Boolean).pop() ?? ''
}

/**
 * Finds a single Medium post by its slug.
 */
export async function getMediumPostBySlug(username: string, slug: string) {
  const { items } = await getLatestMediumPosts(username)
  return (
    items.find((item) => {
      return slugFromLink(encodeURIComponent(item.link)).includes(
        // there is some RSS feed in query params 🥲
        encodeURIComponent(slug),
      )
    }) ?? null
  )
}
