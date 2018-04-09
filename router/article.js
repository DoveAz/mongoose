const Router = require('koa-router')
const router = new Router()
const { Article, User } = require('../model')
router.get('/', async (ctx, next) => {
    await Article.find().populate('author').then(res => {
        ctx.body = res
    })
})
router.post('/', async (ctx, next) => {
    await Article.create(ctx.request.body).then(res => {
        ctx.body = {
            code: 1
        }
    })
})
router.del('/:id', async (ctx, next) => {
    await Article.findByIdAndRemove(ctx.params.id).then(res => {
        ctx.body = {
            code: 1
        }
    })
})
module.exports = router