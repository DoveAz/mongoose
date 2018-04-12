module.exports = async function(ctx,next){
    try {
        await next()
    } catch (err) {
        if (err.name === 'ValidationError') {
            ctx.status = 400
            ctx.body = {
                msg: err.errors.title.message
            }
        }else{
            console.log(err)
        }
    }
}