const Router = require('koa-router')
const multer = require('koa-multer')
const router = new Router()
const fs = require('fs')
const {Article,User} = require('../model')


router.get('/', async (ctx, next) => {
    ctx.response.type = "html"
    ctx.body = fs.readFileSync('./index.html')
})

router.use('/article',require('./article').routes())
router.use('/user', require('./user').routes())

router.post('/login', async (ctx, next) => {
    const {
        username,
        password
    } = ctx.request.body
    await User.findOne({
        username,
        password
    }).then(res => {
        if (res.length > 0) {
            ctx.session.userId = res[0]._id
            ctx.body = {
                code: 1
            }
        } else {
            ctx.status = 401
            ctx.body = {
                msg: "账号或密码错误"
            }
        }
    })
})

router.get('/profile', async (ctx, next) => {
    await User.findOne({
        _id: ctx.session.userId
    }).then(res => {
        ctx.body = res
    })
})

let uploadMulter = multer({
    limits: {
        files: 20,
        fileSize: 20000000
    },
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'upload/')
        },
        filename(req, file, cb) {
            cb(null, file.originalname)
        }
    })

})
router.post('/upload', uploadMulter.array('images'), async (ctx, next) => {
    console.log(ctx.req.files.map(e => e.path))
    ctx.body = {
        errno: 0,
        data: ctx.req.files.map(e => e.path)
    }
})

module.exports = router