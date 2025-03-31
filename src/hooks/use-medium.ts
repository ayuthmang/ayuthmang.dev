import axios from 'axios'
import type { RssToJsonMediumResponse } from './use-medium.types'
import { useSuspenseQuery } from '@tanstack/react-query'

const rssToJsonUrl =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/{username}'

async function getLatestMediumPosts(username: string) {
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
  })

  return postsQuery
}
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
