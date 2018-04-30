const { get, post, put, del, controller, admin, auth, required } = require('../lib/decorator')
const {
  checkPassword,
  getAllUsers,
  registerUser,
  checkUser
} = require('../service/user')

@controller('api/client/user')
export class userController {
  @post('/login') // 登录
  @required({
    body: ['email', 'password']
  })
  async login (ctx, next) {
    const { email, password } = ctx.request.body
    const matchData = await checkPassword(email, password)
    if (matchData.match) {
      ctx.session.user = matchData.user
      ctx.body = {
        code: 0,
        errmsg: '',
        data: {
          user: matchData.user
        }
      }
    } else {
      ctx.body = {
        code: 1,
        errmsg: '账号或密码不正确',
      }
    }
  }
  
  @post('/check_user') //判断email是否存在
  @required({
    body: ['email']
  })
  async check (ctx, next) {
    const { email } = ctx.request.body
    const bol = await checkUser(email)
    if (!bol) {
      ctx.body = {
        code: 0,
        errmsg: '用户不存在',
      }
    } else {
      ctx.body = {
        code: 1,
        errmsg: '用户已存在',
      }
    }
  }

  @post('/register') // 注册用户
  @required({
    body: ['email', 'password', 'username']
  })
  async register (ctx, next) {
    const { username, email, password } = ctx.request.body
    const retData = await registerUser(username, email, password)
    if (retData.result) {
      ctx.body = {
        code: 0,
        errmsg: '注册成功',
        user: retData.user
      }
    } else {
      ctx.body = {
        code: 1,
        errmsg: retData.msg,
      }
    }
  }

  @post('/logout') // 注销用户
  async logout (ctx, next) {
    ctx.session.user = undefined;
    ctx.body = {
      code: 0,
      errmsg: '注销成功'
    }
  }

  @get('/get_userinfo')
  async getInfo (ctx, next) {
    if (ctx.session.user) {
      ctx.body = {
        code: 0,
        data: {
          user: ctx.session.user
        },
        errmsg: ''
      }
    } else {
      ctx.body = {
        code: 10,
        errmsg: '用户未登录'
      }
    }
  }
}

