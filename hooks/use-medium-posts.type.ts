// export interface MediumRssResponse {
//   version: string
//   title: string
//   home_page_url: string
//   description: string
//   author: Author
//   items: Item[]
// }

// export interface Author {
//   name: string
// }

// export interface Item {
//   guid: string
//   url: string
//   title: string
//   content_html: string
//   date_published: string
//   author: Author2
// }

// export interface Author2 {
//   name: string
// }

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
  thumbnail: string
  description: string
  content: string
  enclosure: Enclosure
  categories: string[]
}

export interface Enclosure {}
