// 爬取豆瓣网站的电影信息

const Subscription = require('egg').Subscription;
const request = require('superagent');
const cheerio = require('cheerio');

class CrawlingDouban extends Subscription {
  static get schedule() {
    return {
      cron: '0 8 * * *',
      type: 'worker',
    };
  }

  async subscribe() {
    if (this.config.env === 'local') {
      console.log('定时任务被触发')
      return
    }
    await this.app.mysql.delete('movie');
    // 正在热映
    let res = await request.get('https://movie.douban.com/cinema/nowplaying/hangzhou/');
    let $ = cheerio.load(res.text);
    $('#nowplaying ul.lists .list-item').each(async (i, elem) => {
      const href = $(elem).find('.stitle a').attr('href');
      this.insertDataBase(await this.getMovieDetail(href, '1'))
    })
    // 即将上映
    res = await request.get('https://movie.douban.com/coming');
    $ = cheerio.load(res.text);
    $('table.coming_list tbody tr').each(async (i, elem) => {
      const href = $(elem).find('td:nth-of-type(2) > a').attr('href');
      this.insertDataBase(await this.getMovieDetail(href,'0'))
    })
  }

  // 访问电影详情，拿到电影详细资料
  async getMovieDetail(href, isPlay) {
    const res = await request.get(href);
    const $ = cheerio.load(res.text);
    const idMatched = href.match(/subject\/(\d+)/)
    const movie = { id: idMatched[1], isPlay };
    // 名称
    movie.title = $(`[property="v:itemreviewed"]`).text()
    // 导演
    movie.author = $(`[rel="v:directedBy"]`).first().text()
    // 时长
    movie.duration = $(`[property="v:runtime"]`).text()
    // 类型
    movie.categories = []; 
    $(`[property="v:genre"]`).each((i, elm) => {
      movie.categories.push($(elm).text())
    })
    // 上映日期
    movie.pubdate = $(`[property="v:initialReleaseDate"]`).first().text()
    // 评分
    movie.rate =  $(`[property="v:average"]`).text() 
    // 简介
    movie.summary = $(`[property="v:summary"]`).text().replace(/\s*/g,"");
    // 封面
    movie.poster = $('div#mainpic img').attr("src");
    // 演员
    movie.casts = []
    $('ul.celebrities-list li:not(.fake)').each((i, elm) => {
      const name = $(elm).find('a.name').text();
      const matched = $(elm).find('.avatar').attr('style').match(/(https[s]?:[^)]+)/);
      if (!matched || !matched.length) return;
      movie.casts.push({
        name,
        avatar: matched[1]
      })
    })
    // 预告片
    const trailer = $('li.label-trailer a');
    if (trailer.length) {
      movie.cover = trailer.attr('style').match(/(https[s]?:[^)]+)/)[1];
      movie.video = await this.getMovieTrailer(trailer.attr('href'))
    }
    
    return movie;
  }

  // 访问电影预告片详情，拿到资源链接
  async getMovieTrailer(href) {
    const res = await request.get(href);
    const $ = cheerio.load(res.text);
    return $('source').attr('src');
  }

  // 插入数据库
  async insertDataBase(movie) {
    // fix: 没有video过滤掉
    if (!movie.video) {
      return;
    }
    // 1.获取电影分类的id，分类不存在创建
    const categoryIds = await Promise.all(
      movie.categories.map(name => {
        return new Promise(async (resolve, reject) => {
          const category =  await this.app.mysql.get('category', { name });
          if (category) {
            resolve(category.id)
          } else {
            const result = await this.app.mysql.insert('category', { name });
            resolve(result.insertId)
          }
        })
      })
    )
    // 2.规范化casts、movieTypes
    delete movie.categories
    movie.movieTypes = String(categoryIds);
    movie.casts = JSON.stringify(movie.casts);
    // 3.插入数据库
    try {
      const result = await this.app.mysql.insert('movie', movie);
      if (result.affectedRows) {
        this.logger.info(`爬取电影id: ${movie.id} 成功！`)
      }
    } catch (error) {
       this.logger.info(`爬取电影id: ${movie.id} 失败！`)
       this.logger.error(`爬取电影id: ${movie.id} 错误信息`, error)
    }
    
  }

}

module.exports = CrawlingDouban;