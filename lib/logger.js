const chalk = require('chalk')
module.exports = async function (ctx, next) {
    const start = new Date().getTime()
    await next()
    const spendTime = new Date().getTime() - start
    let text = [
        ctx.status < 400 ? chalk.blue(ctx.status) : chalk.red(ctx.status),
        chalk.red(ctx.method),
        chalk.blue(ctx.url),
        chalk.green(spendTime) + 'ms'
    ]
    console.log(text.join(' '))

}