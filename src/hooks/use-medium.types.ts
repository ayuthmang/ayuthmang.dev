export interface RssToJsonMediumResponse {
  status: string
  feed: Feed
  items: Item[]
}

export interface Feed {
  url: string
  title: string
  link: string
  author: string
  description: string
  image: string
}

export interface Item {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  /**
   * For the older version of API, it returns the thumbnail image url.
   * I'm no sure when it's changed, but we'll use the parser to get the thumbnail from response and attach to this property.
   */
  thumbnail: string
  description: string
  content: string
  enclosure: Enclosure
  categories: string[]
}

export interface Enclosure {}
