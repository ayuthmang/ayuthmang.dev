import axios from 'axios'
import type { Item, RssToJsonMediumResponse } from './use-medium.types'
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

function stripQueryAndHash(value: string): string {
  return value.split('?')[0].split('#')[0]
}

/**
 * Derives a short URL-safe slug from a Medium article link.
 * Medium article URLs end with a stable post id after the final hyphen.
 */
export function slugFromLink(link: string): string {
  const lastSegment = stripQueryAndHash(link).split('/').filter(Boolean).pop() ?? ''
  if (!lastSegment) return ''

  const decodedSegment = decodeURIComponent(lastSegment)
  return decodedSegment.split('-').pop() ?? decodedSegment
}

/**
 * Fetches Medium posts but never throws — returns an empty list if the RSS
 * feed is unreachable (e.g. during a build with no network). Lets local MDX
 * posts render even when Medium is down.
 */
export async function getMediumItemsSafe(username: string): Promise<Item[]> {
  try {
    const { items } = await getLatestMediumPosts(username)
    return items
  } catch (error) {
    console.warn(
      '[medium] failed to fetch posts, continuing without them:',
      error instanceof Error ? error.message : error,
    )
    return []
  }
}

/**
 * Like {@link getMediumPostBySlug} but never throws; returns `null` on failure.
 */
export async function getMediumPostBySlugSafe(username: string, slug: string) {
  try {
    return await getMediumPostBySlug(username, slug)
  } catch (error) {
    console.warn(
      '[medium] failed to fetch post by slug, continuing without it:',
      error instanceof Error ? error.message : error,
    )
    return null
  }
}

/**
 * Finds a single Medium post by its slug.
 */
export async function getMediumPostBySlug(username: string, slug: string) {
  const normalizedSlug = decodeURIComponent(slug)
  const { items } = await getLatestMediumPosts(username)
  return (
    items.find((item) => {
      const itemPath = stripQueryAndHash(item.link).split('/').filter(Boolean).pop() ?? ''
      const decodedItemPath = decodeURIComponent(itemPath)
      return [slugFromLink(item.link), decodedItemPath].includes(normalizedSlug)
    }) ?? null
  )
}
