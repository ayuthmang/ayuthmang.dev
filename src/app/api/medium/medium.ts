import axios from 'axios'
import type { RssToJsonMediumResponse } from './medium.type'

const rssToJsonUrl =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/{username}'

export const getLatestMediumPosts = async function (username: string) {
  const data = await axios.get<RssToJsonMediumResponse>(
    rssToJsonUrl.replace('{username}', username),
  )
  const items = data.data.items

  return items
}
