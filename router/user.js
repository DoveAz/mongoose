const Router = require('koa-router')
const router = new Router()
const User = require('../model/User')

router.get('/', async (ctx, next) => {
    await User.find().then(res => {
        ctx.body = res
    })
})

router.post('/', async (ctx, next) => {
    await User.findOne({username:ctx.request.body.username}).then(async res=>{
        if(res){
            ctx.status = 400
            ctx.body = {msg:'已存在的用户名'}
        }else{
            await User.create(ctx.request.body).then(res => {
                ctx.body = {_id:res._id}
            })
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