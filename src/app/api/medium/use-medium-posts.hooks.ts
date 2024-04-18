import axios from 'axios'
import type { RssToJsonMediumResponse } from './type'
import { useQuery } from '@tanstack/react-query'

const rssToJsonUrl =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/{username}'

async function getLatestMediumPosts(username: string) {
  const response = await axios.get<RssToJsonMediumResponse>(
    rssToJsonUrl.replace('{username}', username),
  )
  return response.data
}

export function useLatestMediumPosts(username: string) {
  const postsQuery = useQuery({
    queryKey: ['mediumPosts', username],
    queryFn: () => getLatestMediumPosts(username),
  })

  return postsQuery
}
