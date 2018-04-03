const puppeteer = require('puppeteer')

const nowUrl = 'https://movie.douban.com/cinema/nowplaying/beijing/'
const comUrl = 'https://movie.douban.com/coming'

const sleep = time => new Promise((resolve) => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('正在爬取')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.goto(nowUrl, {
    waitUntil: 'networkidle2'
  })
  await page.waitForSelector('.more')
  await sleep(3000)
  await page.click('.more')
  await sleep(3000)
  let result = await page.evaluate(() => {
    const $ = window.$
    const items = $('#nowplaying .list-item')
    let data = []
    items.each((index, item) => {
      const it = $(item)
      const doubanId = it.data('subject')
      const rate = it.data('score')
      const title = it.data('title')
      const poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
      data.push({
        rate,
        title,
        poster,
        doubanId,
      })
    })
    return data
  })
  await page.goto(comUrl, {
    waitUntil: 'networkidle2'
  })  
  await sleep(3000)
  let links = await page.evaluate(() => {
    const arr = []
    const $ = window.$
    const items = $('.coming_list tbody').find('a')
    items.each((index, item) => {
      arr.push($(item).attr('href'))
    })
    return arr
  })
  console.log(links.length)
  for (let i = 0; i < links.length; i++) {
    await page.goto(links[i], {
      waitUntil: 'networkidle2'
    })  
    let ret = await page.evaluate(() => {
      const $ = window.$
      var reg = new RegExp('/subject/([0-9]*)/')
      const doubanId = (location.href.match(reg))[1]
      const title = $('#content').find('h1 span').eq(0).text()
      const rate = 0
      const poster = $('.nbgnbg').find('img').attr('src')
      return {
        doubanId,
        title,
        rate,
        poster
      }
    })
    console.log(ret)
    result.push(ret)
  }
  await browser.close()
  process.send({result})
  process.exit(0)
})()