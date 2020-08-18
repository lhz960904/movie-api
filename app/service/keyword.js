

const Service = require('egg').Service;

class KeyWordService extends Service {

  async index() {
    const result = await this.app.mysql.select('keyword', {
      orders: [['count','desc']],
      columns: ['name', 'count'],
      limit: 10
    })

    return result;
  }

  async updateOrCreate(name) {
    const result = await this.app.mysql.select('keyword', {
      where: { name }
    })
    // 存在更新数量
    if (result.length) {
      const current = result[0]
      // console.log('存在', name)
      await this.app.mysql.update('keyword', { ...current, count: current.count + 1 });
    } else {
      // 不存在新建
      //  console.log('新建', name)
      await this.app.mysql.insert('keyword', { name, count: 1 });
    }
  }
}

module.exports = KeyWordService;