const Service = require('egg').Service;

class MovieService extends Service {
  async index(params = {}) {
    let { status, rate, keyword, categories } = params;
    const { escape }  = this.app.mysql;
    let sql = `select * from movie where 1 = 1`;
    //  电影状态
    if (status) {
      sql += ` and isPlay = ${escape(status)}`
    }
    // 评分区间
    if ((!status || status === '1') && rate) {
      rate = JSON.parse(rate);
      sql += ` and rate between ${escape(rate[0])} and ${escape(rate[1])}`
    }
    // name关键词
    if (keyword) {
      sql += ` and title like ${escape(`%${keyword}%`)}`
    }
    console.log(sql)

    let result = await this.app.mysql.query(sql);
    result = await this.normalize(result);
    // 分类
    if (categories) {
      categories = JSON.parse(categories);
      result = result.filter(item => item.movieTypes.some(type => categories.includes(type.id)));
    }
    
    return result;
  }

  async getHot(isPlay) {
    const [{ 'COUNT(*)': count }] = await this.app.mysql.query(`SELECT COUNT(*) from movie where isPlay = '${isPlay}'`);
    const movies = await this.selectByCondition({
      where: { isPlay },
      orders: [['rate','desc']],
      limit: 8, 
    })
    return { count,  movies };
  }

  async getByStatus(params) {
    const { page, pageSize, status } = params;
    const [{ 'COUNT(*)': count }] = await this.app.mysql.query(`SELECT COUNT(*) from movie where isPlay = '${status}'`);
    const movies = await this.selectByCondition({
      where: { isPlay: status },
      orders: [['rate','desc']],
      limit: +pageSize, 
      offset: +page * pageSize,
    })
    return { total: count, list: movies }
  }

  async getRank() {
    const movies = await this.selectByCondition({
      orders: [['viewCount','desc']],
      limit: 10, 
    })
    return movies;
  }

  async getDetail(id) {
    const movie = await this.selectByCondition({
      where: { id },
    })
    return movie[0]
  }

  async selectByCondition(options = {}) {
    let movies = await this.app.mysql.select('movie', options);
    return await this.normalize(movies);
  }

  async normalize(movies) {
    return Promise.all(movies.map(async movie => ({
      ...movie,
      movieTypes: await this.service.category.getCategoryByIds(movie.movieTypes.split(',')),
      casts: JSON.parse(movie.casts)
    })))
  }
}

module.exports = MovieService;