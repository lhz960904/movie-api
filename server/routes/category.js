const {
  get,
  controller,
  success
} = require('../lib/decorator')

const {
  _getCategorys
} = require('../service/category')

@controller('/api/category')
export class categoryController {

  @get('get_cates')
  async getCategorys(ctx, next) {
    const data = await _getCategorys()
    success(ctx, data)
  }

}