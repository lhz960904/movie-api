const { get, post, put, del, controller } = require('../lib/decorator')
const {
  checkPassword
} = require('../service/user')

@controller('/user')
export class movieController {
  @post('/')
  async check(ctx, next) {
    const { email, password } = ctx.request.body
    const matchData = await checkPassword(email, password)
    
    if (matchData.match) {
      ctx.body = {
        code: 0,
        errmsg: '',
        data: {
          user: matchData.user
        }
      }
    } else {
      ctx.body = {
        code: 0,
        errmsg: '账号或密码不正确',
      }
    }
  }
}

