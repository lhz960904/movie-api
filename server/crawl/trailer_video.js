const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/subject/'

const sleep = time => new Promise((resolve) => {
  setTimeout(resolve, time)
})

process.on('message', async movies => {
  console.log('开始爬取页面...')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  for (let i = 0; i < movies.length; i++) {
    let doubanId = movies[i].doubanId
    await page.goto(url + doubanId, {
      waitUntil: 'networkidle2'
    })
    await sleep(1000)
    const result = await page.evaluate(() => {
      const $ = window.$
      const it = $('.related-pic-video')
      if (it && it.length > 0) {
        const link = it.attr('href')
        const cover = it.find('img').attr('src')
        return {
          link,
          cover
        }
      }
    })
    let video
    if (result && result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
      await sleep(2000)
      video = await page.evaluate(() => {
        var $ = window.$
        var it = $('source')

        if (it && it.length > 0) {
          return it.attr('src')
        }
      })
    }
    const data = {
      video,
      doubanId,
      cover: result && result.cover
    }
    process.send(data)
  }
  browser.close()
  process.exit(0)
})