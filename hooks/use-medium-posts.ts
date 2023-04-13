import React, { useEffect } from 'react'
import axios from 'axios'
import type { RssToJsonMediumResponse } from './use-medium-posts.type'

const rssToJsonUrl =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ayuthmang'

export default function useMediumPosts() {
  const [posts, setPosts] = React.useState<
    RssToJsonMediumResponse['items'] | null
  >(null)

  useEffect(() => {
    async function runEffect() {
      try {
        const data = await axios.get<RssToJsonMediumResponse>(rssToJsonUrl)
        const items = data.data.items
        setPosts(items)
        console.log({ items })
      } catch (error) {}
    }

    runEffect()
  }, [])

  return { posts }
}
