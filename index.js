const Koa = require('koa')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const app = new Koa()
const server = require('koa-static')
const router = require('./router')

app.keys = ['mongooseSession']
const CONFIG = {
	key: 'koa:sess',
	/** (string) cookie key (default is koa:sess) */
	/** (number || 'session') maxAge in ms (default is 1 days) */
	/** 'session' will result in a cookie that expires when session/browser is closed */
	/** Warning: If a session cookie is stolen, this cookie will never expire */
	maxAge: 86400000,
	overwrite: true,
	/** (boolean) can overwrite or not (default true) */
	httpOnly: true,
	/** (boolean) httpOnly or not (default true) */
	signed: true,
	/** (boolean) signed or not (default true) */
	rolling: false,
	/** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
	renew: false,
	/** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));
app.use(cors())
app.use(bodyParser())

app.use(router.routes())
app.use(server(__dirname))

app.listen(3000)