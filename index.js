const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const fs = require('fs')
const session = require('koa-session')
const app = new Koa()
const _ =	require('lodash')
	

app.keys = ['mongooseSession']
const CONFIG = {
	key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
	/** (number || 'session') maxAge in ms (default is 1 days) */
	/** 'session' will result in a cookie that expires when session/browser is closed */
	/** Warning: If a session cookie is stolen, this cookie will never expire */
	maxAge: 86400000,
	overwrite: true, /** (boolean) can overwrite or not (default true) */
	httpOnly: true, /** (boolean) httpOnly or not (default true) */
	signed: true, /** (boolean) signed or not (default true) */
	rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
	renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));

const mongoose = require('mongoose')
mongoose.connect('mongodb://doveaz:qw1234@shenhaibulan.com/cms')
const db = mongoose.connection
db.once('open',function(){
	console.log('数据库连接成功')
})
const articleSchema = mongoose.Schema({
	title:String,
	content:String,
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	}
})
const Article = mongoose.model('Article',articleSchema)

const userSchema = mongoose.Schema({
	username:String,
	password:String
})
const User = mongoose.model('User',userSchema)



app.use(cors())
app.use(bodyParser())
const router = new Router()

router.get('/',async(ctx,next)=>{
	ctx.response.type="html"
	ctx.body = fs.readFileSync('./index.html')
})

router.get('/article',async (ctx,next)=>{
	await Article.find().populate('author').then(res=>{
		ctx.body =  res
	})
})
router.post('/article',async(ctx,next)=>{
	await Article.create(ctx.request.body).then(res=>{
		ctx.body = {code:1}
	})
})
router.del('/article/:id',async(ctx,next)=>{
	await Article.findByIdAndRemove(ctx.params.id).then(res=>{
		ctx.body = {code:1}
	})
})



router.get('/user',async(ctx,next)=>{
	await User.find().then(res=>{
		ctx.body=res
	})
})

router.post('/user',async(ctx,next)=>{
	await User.create(ctx.request.body).then(res=>{
		ctx.body = { code: 1}
	})
})

router.del('/user/:id',async (ctx,next)=>{
	let consult = await Article.find({author:ctx.params.id}).then(async res=>{
		if(res.length>0){
			ctx.throw(409, '无法删除，该作者还有作品在这里呢')
		}else{
			await User.findByIdAndRemove(ctx.params.id).then(res => {
				ctx.body = { code: 1 }
			})
		}
	})
	
})

router.post('/login',async(ctx,next)=>{
	const {username,password} = ctx.request.body
	await User.findOne({ username, password}).then(res=>{
		if(res.length>0){
			ctx.session.userId = res[0]._id
			ctx.body = {code:1}
		}else{
			ctx.status = 401
			ctx.body = {msg:"账号或密码错误"}
		}
	})
})

router.get('/profile',async(ctx,next)=>{
	await User.findOne({_id:ctx.session.userId}).then(res=>{
		ctx.body = res
	})
})



app.use(router.routes())

app.listen(3000)


