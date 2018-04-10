const Router = require('koa-router')
const router = new Router()
const Article = require('../model/Article')

router.get('/', async (ctx, next) => {
    const {page,count}=ctx.query
    await Article.find().sort('-createdAt').skip(page*count).limit(count).populate('author','-password').then(res => {
        ctx.body = res
    })
})
router.post('/', async (ctx, next) => {
    await Article.create(ctx.request.body).then(res => {
        ctx.body = {
            _id:res._id
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