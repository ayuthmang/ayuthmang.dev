import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  extractImg,
  slugFromLink,
  getLatestMediumPosts,
  getMediumPostBySlug,
} from '../use-medium'
import type { RssToJsonMediumResponse } from '../use-medium.types'

const MEDIUM_USERNAME = '@ayuthmang'
const MEDIUM_FEED_URL = `https://medium.com/feed/${MEDIUM_USERNAME}`

const MEDIUM_RESPONSE_FIXTURE: RssToJsonMediumResponse = {
  status: 'ok',
  feed: {
    url: MEDIUM_FEED_URL,
    title: 'Stories by Ayuth Mangmesap on Medium',
    link: 'https://medium.com/@ayuthmang?source=rss-37b3ab8c5bd------2',
    author: '',
    description: 'Stories by Ayuth Mangmesap on Medium',
    image: 'https://cdn-images-1.medium.com/fit/c/150/150/1*wYiqpmeZ3W9HVpNRHn3cGQ.png',
  },
  items: [
    {
      title: 'แหล่งเรียนรู้ Git สำหรับผู้เริ่มต้นถึงระดับสูง  by GitKraken',
      pubDate: '2026-01-13 05:14:10',
      link: 'https://medium.com/ayuth/%E0%B9%81%E0%B8%AB%E0%B8%A5%E0%B9%88%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A3%E0%B8%B9%E0%B9%89-git-%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B9%80%E0%B8%A3%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%95%E0%B9%89%E0%B8%99%E0%B8%96%E0%B8%B6%E0%B8%87%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%B9%E0%B8%87-by-gitkraken-337b6ff5f540?source=rss-37b3ab8c5bd------2',
      guid: 'https://medium.com/p/337b6ff5f540',
      author: 'Ayuth Mangmesap',
      thumbnail: '',
      description:
        '\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*SjH2MxAzpJLBl4xV9o4kvA.png"></figure><p>บล็อกนี้จะรวบรวมแหล่งข้อมูลที่เกี่ยวกับการ Git สำหรับมือใหม่และมือเก๋าครับ เนื่องจากตัวผมเองเมื่อตอนเริ่มต้นศึกษาและใช้งาน Git ก็เจอปัญหาเยอะเหมือนกันจนกว่าจะใช้ได้ในชีวิตประจำวัน เอาละไปอ่านกันเลยครับ</p>\n<h3>Problem — Tutorial Hell 😵‍💫</h3>\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/735/0*J86-UBa3yRGT4hOu.jpg"></figure><p>ปัญหาของการหา tutorial ไม่ว่าจะ บล็อกโพสต์ วีดีโอ หรือในรูปแบบอื่นที่เราได้แต่ทำตามแต่ไม่ได้เข้าใจอะไรเลย บางทีเราเข้าป่าไปเจออย่างหนึ่งแต่ดันไปเจออีกอย่างที่ไม่ได้เกี่ยวข้องจนเรางงจับต้นชนปลายไม่ถูก เราแค่ “ทำตามไป” จนได้ “ผลลัพธ์” ออกมาแต่ไม่เข้าใจอะไรเลย</p>',
      content:
        '\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*SjH2MxAzpJLBl4xV9o4kvA.png"></figure><p>บล็อกนี้จะรวบรวมแหล่งข้อมูลที่เกี่ยวกับการ Git สำหรับมือใหม่และมือเก๋าครับ เนื่องจากตัวผมเองเมื่อตอนเริ่มต้นศึกษาและใช้งาน Git ก็เจอปัญหาเยอะเหมือนกันจนกว่าจะใช้ได้ในชีวิตประจำวัน เอาละไปอ่านกันเลยครับ</p>\n<h3>Problem — Tutorial Hell 😵‍💫</h3>\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/735/0*J86-UBa3yRGT4hOu.jpg"></figure><p>ปัญหาของการหา tutorial ไม่ว่าจะ บล็อกโพสต์ วีดีโอ หรือในรูปแบบอื่นที่เราได้แต่ทำตามแต่ไม่ได้เข้าใจอะไรเลย บางทีเราเข้าป่าไปเจออย่างหนึ่งแต่ดันไปเจออีกอย่างที่ไม่ได้เกี่ยวข้องจนเรางงจับต้นชนปลายไม่ถูก เราแค่ “ทำตามไป” จนได้ “ผลลัพธ์” ออกมาแต่ไม่เข้าใจอะไรเลย</p>',
      enclosure: {},
      categories: ['git', 'learn-git', 'gitkraken'],
    },
    {
      title: 'ติดตั้งและใช้งาน GitKraken CLI',
      pubDate: '2026-01-03 06:04:54',
      link: 'https://medium.com/ayuth/%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B8%B1%E0%B9%89%E0%B8%87-gitkraken-cli-b5560900f8ce?source=rss-37b3ab8c5bd------2',
      guid: 'https://medium.com/p/b5560900f8ce',
      author: 'Ayuth Mangmesap',
      thumbnail: '',
      description:
        '\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*MjLLYydKcC75uqb7OjVjHg.jpeg"></figure><p>หลายท่านประสบปัญหาในการติดตั้งและใช้งาน(ผมก็เช่นกัน) ดังนั้นผมจึงเขียนบันทึกไว้เบื้องต้นสำหรับติดตั้งและแก้ปัญหาสำหรับการใช้งาน <a href="https://www.gitkraken.com/cli">GitKraken CLI</a> ครับ</p>\n<p>ติดตั้ง <a href="https://www.gitkraken.com/cli">GitKraken CLI</a></p>\n<h4>Install on macOS (Homebrew):</h4>\n<pre>$ brew install gitkraken-cli</pre>',
      content:
        '\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*MjLLYydKcC75uqb7OjVjHg.jpeg"></figure><p>หลายท่านประสบปัญหาในการติดตั้งและใช้งาน(ผมก็เช่นกัน) ดังนั้นผมจึงเขียนบันทึกไว้เบื้องต้นสำหรับติดตั้งและแก้ปัญหาสำหรับการใช้งาน <a href="https://www.gitkraken.com/cli">GitKraken CLI</a> ครับ</p>\n<p>ติดตั้ง <a href="https://www.gitkraken.com/cli">GitKraken CLI</a></p>\n<h4>Install on macOS (Homebrew):</h4>\n<pre>$ brew install gitkraken-cli</pre>',
      enclosure: {},
      categories: ['git', 'gitkraken-cli', 'gitkraken', 'github'],
    },
  ],
}

const server = setupServer(
  http.get('https://api.rss2json.com/v1/api.json', ({ request }) => {
    const rssUrl = new URL(request.url).searchParams.get('rss_url')

    if (rssUrl !== MEDIUM_FEED_URL) {
      return HttpResponse.json(
        {
          status: 'error',
          feed: MEDIUM_RESPONSE_FIXTURE.feed,
          items: [],
        } satisfies RssToJsonMediumResponse,
        { status: 404 },
      )
    }

    return HttpResponse.json(MEDIUM_RESPONSE_FIXTURE)
  }),
)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

// ---------------------------------------------------------------------------
// extractImg
// ---------------------------------------------------------------------------

describe('extractImg', () => {
  test('extracts src from an img inside a figure (double quotes)', () => {
    const html = `<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/photo.png"></figure><p>Text</p>`
    expect(extractImg(html)).toBe('https://cdn-images-1.medium.com/max/1024/photo.png')
  })

  test('extracts src when img has additional attributes before src', () => {
    const html = `<img class="hero" alt="cover" src="https://cdn.example.com/img.jpg">`
    expect(extractImg(html)).toBe('https://cdn.example.com/img.jpg')
  })

  test('extracts src from single-quoted attribute', () => {
    const html = `<img src='https://cdn.example.com/single-quote.jpg'>`
    expect(extractImg(html)).toBe('https://cdn.example.com/single-quote.jpg')
  })

  test('returns the first img src when multiple images are present', () => {
    const html = `
      <img src="https://cdn.example.com/first.png">
      <img src="https://cdn.example.com/second.png">
    `
    expect(extractImg(html)).toBe('https://cdn.example.com/first.png')
  })

  test('does NOT match src on non-img elements (regression for old broad regex)', () => {
    const html = `<source src="https://cdn.example.com/video.mp4"><script src="/app.js"></script>`
    expect(extractImg(html)).toBeNull()
  })

  test('returns null when no img tag is present', () => {
    const html = `<p>No images here.</p><h3>Just text</h3>`
    expect(extractImg(html)).toBeNull()
  })

  test('returns null for an empty string', () => {
    expect(extractImg('')).toBeNull()
  })

  test('handles img tag with no src attribute', () => {
    const html = `<img alt="no src here">`
    expect(extractImg(html)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// slugFromLink
// ---------------------------------------------------------------------------

describe('slugFromLink', () => {
  test('extracts the post id from a standard Medium URL', () => {
    const url = 'https://medium.com/@ayuthmang/understanding-react-hooks-abc123def456'
    expect(slugFromLink(url)).toBe('abc123def456')
  })

  test('strips query parameters before extracting the slug', () => {
    const url = 'https://medium.com/@ayuthmang/my-article-abc123?source=rss-37b3ab8c5bd------2'
    expect(slugFromLink(url)).toBe('abc123')
  })

  test('handles a URL with a trailing slash', () => {
    const url = 'https://medium.com/@ayuthmang/my-article-abc123/'
    expect(slugFromLink(url)).toBe('abc123')
  })

  test('handles a URL whose only path is the username', () => {
    const url = 'https://medium.com/@ayuthmang'
    expect(slugFromLink(url)).toBe('@ayuthmang')
  })

  test('returns an empty string when the input is an empty string', () => {
    expect(slugFromLink('')).toBe('')
  })

  test('works with a path-only string (no domain)', () => {
    expect(slugFromLink('/blog/my-post-xyz')).toBe('xyz')
  })
})

// ---------------------------------------------------------------------------
// getLatestMediumPosts
// ---------------------------------------------------------------------------

describe('getLatestMediumPosts', () => {
  test('returns items with thumbnail populated from actual feed content', async () => {
    const result = await getLatestMediumPosts(MEDIUM_USERNAME)

    expect(result.status).toBe('ok')
    expect(result.items).toHaveLength(2)
    expect(result.items[0].thumbnail).toBe(
      'https://cdn-images-1.medium.com/max/1024/1*SjH2MxAzpJLBl4xV9o4kvA.png',
    )
    expect(result.items[1].thumbnail).toBe(
      'https://cdn-images-1.medium.com/max/1024/1*MjLLYydKcC75uqb7OjVjHg.jpeg',
    )
  })

  test('preserves all other item fields unchanged', async () => {
    const result = await getLatestMediumPosts(MEDIUM_USERNAME)
    const returned = result.items[0]

    expect(returned.title).toBe(MEDIUM_RESPONSE_FIXTURE.items[0].title)
    expect(returned.link).toBe(MEDIUM_RESPONSE_FIXTURE.items[0].link)
    expect(returned.categories).toEqual(MEDIUM_RESPONSE_FIXTURE.items[0].categories)
    expect(returned.author).toBe(MEDIUM_RESPONSE_FIXTURE.items[0].author)
  })

  test('returns empty items when the API responds with no posts', async () => {
    server.use(
      http.get('https://api.rss2json.com/v1/api.json', () =>
        HttpResponse.json({
          status: 'ok',
          feed: MEDIUM_RESPONSE_FIXTURE.feed,
          items: [],
        } satisfies RssToJsonMediumResponse),
      ),
    )

    const result = await getLatestMediumPosts(MEDIUM_USERNAME)

    expect(result.items).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// getMediumPostBySlug
// ---------------------------------------------------------------------------

describe('getMediumPostBySlug', () => {
  test('returns the matching post when slug is found', async () => {
    const result = await getMediumPostBySlug(
      MEDIUM_USERNAME,
      slugFromLink(MEDIUM_RESPONSE_FIXTURE.items[0].link),
    )

    expect(result).not.toBeNull()
    expect(result?.title).toBe(MEDIUM_RESPONSE_FIXTURE.items[0].title)
  })

  test('still matches the legacy long Medium slug', async () => {
    const result = await getMediumPostBySlug(
      MEDIUM_USERNAME,
      'แหล่งเรียนรู้-git-สำหรับผู้เริ่มต้นถึงระดับสูง-by-gitkraken-337b6ff5f540',
    )

    expect(result).not.toBeNull()
    expect(result?.guid).toBe(MEDIUM_RESPONSE_FIXTURE.items[0].guid)
  })

  test('returns null when no post matches the slug', async () => {
    const result = await getMediumPostBySlug(MEDIUM_USERNAME, 'non-existent-slug')

    expect(result).toBeNull()
  })

  test('returns null on an empty items list', async () => {
    server.use(
      http.get('https://api.rss2json.com/v1/api.json', () =>
        HttpResponse.json({
          status: 'ok',
          feed: MEDIUM_RESPONSE_FIXTURE.feed,
          items: [],
        } satisfies RssToJsonMediumResponse),
      ),
    )

    const result = await getMediumPostBySlug(MEDIUM_USERNAME, 'any-slug')

    expect(result).toBeNull()
  })
})
