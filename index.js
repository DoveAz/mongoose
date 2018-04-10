const Koa = require('koa')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const app = new Koa()
const server = require('koa-static')
const router = require('./router')
const handlerError = require('./lib/error')
const config = require('./config')
const logger =require('./lib/logger')

config.httpLog && app.use(logger)

app.use(handlerError)
app.use(cors())
app.keys = ['mongooseSession']
app.use(session(config.session, app))
app.use(bodyParser())
app.use(router.routes())
app.use(server(__dirname))

app.listen(3000)