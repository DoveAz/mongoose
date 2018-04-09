const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
const { Article, User } = require('../model')

router.get('/', async (ctx, next) => {
    await User.find().then(res => {
        ctx.body = res
    })
})

router.post('/', async (ctx, next) => {
    await User.create(ctx.request.body).then(res => {
        ctx.body = {
            code: 1
        }
    })
})

router.del('/:id', async (ctx, next) => {
    let consult = await Article.find({
        author: ctx.params.id
    }).then(async res => {
        if (res.length > 0) {
            ctx.throw(409, '无法删除，该作者还有作品在这里呢')
        } else {
            await User.findByIdAndRemove(ctx.params.id).then(res => {
                ctx.body = {
                    code: 1
                }
            })
        }
    })

})

module.exports = router