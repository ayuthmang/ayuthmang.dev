import axios from 'axios'
import type { RssToJsonMediumResponse } from './use-medium-posts.types'
import { useSuspenseQuery } from '@tanstack/react-query'

const rssToJsonUrl =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/{username}'

async function getLatestMediumPosts(username: string) {
  const response = await axios.get<RssToJsonMediumResponse>(
    rssToJsonUrl.replace('{username}', username),
  )
  return response.data
}

export function useLatestMediumPosts(username: string) {
  const postsQuery = useSuspenseQuery({
    queryKey: ['medium', username],
    queryFn: () => getLatestMediumPosts(username),
  })
  return postsQuery
}
