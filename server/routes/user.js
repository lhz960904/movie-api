const { 
  get,
  post, 
  controller, 
  auth, 
  required,
  success,
  error
} = require('../lib/decorator')

const {
  _login,
  _checkEmail,
  _registerUser,
  _getCollects
} = require('../service/user')

@controller('/api/user')
export class userController {
  @post('/login') // 登录
  @required({
    body: ['email', 'password']
  })
  async login (ctx, next) {
    const { match, user } = await _login(ctx.request.body)
    if (match) {
      ctx.session.user = user
      success(ctx, { user })
    } else {
      error(ctx, '账号或密码不正确')
    }
  }

  @post('/register') // 注册用户
  @required({
    body: ['email', 'password', 'username']
  })
  async registerUser (ctx, next) {
    const { email, password } = ctx.request.body
    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (!pattern.test(email)) {
      error(ctx, '邮箱格式不正确')
      return
    }
    if (password.length < 6) {
      error(ctx, '密码长度小于6位')
      return
    }
    const bool = await _checkEmail(ctx.request.body)
    if (bool) {
      error(ctx, '邮箱已经被注册')
      return
    }
    const data = await _registerUser(ctx.request.body)
    success(ctx, data)
  }

  @post('/logout') // 注销用户
  async logout (ctx, next) {
    ctx.session.user = undefined;
    success(ctx)
  }

  @get('/get_collects') // 查看收藏
  @auth
  async getCollects(ctx, next) {
    const data = await _getCollects(ctx.session.user._id)
    success(ctx, data)
  }

}

