const { get, post, put, del, controller, admin, auth, required } = require('../lib/decorator')
// uploadFile
const {
  checkPassword,
  getAllUsers,
  registerUser,
  checkUser,
  collectMovie,
  modifyUser,
} = require('../service/user')
const { getCollectMovies } = require('../service/movie')

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

  @get('/get_userinfo') //获取用户信息
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

  @post('/collect')
  @auth
  async collect (ctx, next) {
    const movieId = ctx.request.body.id
    const userId = ctx.session.user._id
    const res = await collectMovie(userId, movieId)
    if (res) {
      ctx.body = {
        code: 0,
        errmsg: 'ok'
      }
    } else {
      ctx.body = {
        code: 10,
        errmsg: '收藏失败'
      }
    }
  }

  @get('/get_collect_movies')
  @auth
  async getMovies (ctx, next) {
    const collects = ctx.session.user.collects
    const movies = await getCollectMovies(collects)
    ctx.body = {
      code: 0,
      data: {movies},
      errmsg: 'ok'
    }
  }

  // @post('/modify')
  // @auth
  // @uploadFile
  // async modify (ctx, next) { 
  //   const { username, job, birthday, email, password } = ctx.req.body
  //   let headImg
  //   if (ctx.req.file) {
  //     headImg = ctx.req.file.filename
  //   }
  //   const res = await modifyUser({
  //     id: ctx.session.user._id,
  //     username,
  //     job,
  //     birthday,
  //     email,
  //     password,
  //     headImg
  //   })
  //   if (res) {
  //     ctx.body = {
  //       code: 0,
  //       errmsg: 'ok'
  //     }
  //   } else {
  //     ctx.body = {
  //       code: 10,
  //       errmsg: '修改失败'
  //     }
  //   }
  // }
}

