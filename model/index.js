const mongoose = require('mongoose')
mongoose.connect('mongodb://doveaz:qw1234@shenhaibulan.com/cms')
const db = mongoose.connection
db.once('open', function () {
    console.log('数据库连接成功')
})
const articleSchema = mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Article = mongoose.model('Article', articleSchema)

const userSchema = mongoose.Schema({
    username: String,
    password: String
})
const User = mongoose.model('User', userSchema)

module.exports = {
    User,Article
}