const Service = require('egg').Service;

class CategoryService extends Service {
  async index() {
    const result = await this.app.mysql.select('category')
    return result
  }

  async getCategoryByIds(ids) {
    const result = await Promise.all(ids.map(id => this.getCategoryById(id)));
    return result.map(item => item[0]);
  }

  async getCategoryById(id) {
    return await this.app.mysql.select('category', {
      where: { id }
    })
  }
}

module.exports = CategoryService;