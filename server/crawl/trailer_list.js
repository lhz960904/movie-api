const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/tag/#/?sort=R&range=0,10&tags=%E7%94%B5%E5%BD%B1'

const sleep = time => new Promise((resolve) => {
  setTimeout(resolve, time)
})

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })
  await page.waitForSelector('.more')
  for (let i = 0; i < 5; i++) {
    await sleep(3000)
    await page.click('.more')
  }
  await sleep(3000)
  const result = await page.evaluate(() => {
    const $ = window.$
    const items = $('.list-wp a')
    let data = []
    items.each((index, item) => {
      const it = $(item)
      const rate = it.find('.rate').text()
      const title = it.find('.title').text()
      const doubanId = it.find('div').data('id')
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
  await browser.close()
  process.send({result})
  process.exit(0)
})()