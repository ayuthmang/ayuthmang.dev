import { extractImg } from '@/hooks/use-medium'
import { expect, test } from 'vitest'

test('parse figure image properly', () => {
  let input = `\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/1024/1*ZEInIhcKmHDM_uwZICnabA.png\"></figure><p>When it comes to requesting Nest.js. There are plenty of tutorials about how to create request DTO and for validation, but there are no concrete examples for accomplishing that.</p>\n<p>After spending hours of research and testing, I decided to write a blog post to share this and what I have learned in some practices.</p>\n<h3>What is DTO?</h3>`
  let imgSrc = extractImg(input)
  expect(imgSrc).toBe(
    'https://cdn-images-1.medium.com/max/1024/1*ZEInIhcKmHDM_uwZICnabA.png',
  )

  input = `\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/1000/0*LSYkdzPpW0FUmmV6\"><figcaption>Photo by Mateusz Wacławek</figcaption></figure><p>ถ้าจะกล่าวถึง Design Patterns ใน React คงจะหนีไม่พ้น Pattern ที่ชื่อว่า Presentational และ Container Components อยู่ในรายการเป็นอันดับแรก ๆ เป็นแน่</p>\n`
  imgSrc = extractImg(input)
  expect(imgSrc).toBe(
    'https://cdn-images-1.medium.com/max/1000/0*LSYkdzPpW0FUmmV6',
  )
})

test('returns null when cannot detect tag', () => {
  const input =
    '<p>When it comes to requesting Nest.js. There are plenty of tutorials about how to create request DTO and for validation, but there are no concrete examples for accomplishing that.</p>\n<p>After spending hours of research and testing, I decided to write a blog post to share this and what I have learned in some practices.</p>\n<h3>What is DTO?</h3>'
  const imgSrc = extractImg(input)
  expect(imgSrc).toBe(null)
})
