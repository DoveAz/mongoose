const mongoose = require('mongoose')
mongoose.connect('mongodb://doveaz:qw1234@shenhaibulan.com/cms')
const db = mongoose.connection
db.once('open', function () {
    console.log('数据库连接成功')
})
module.exports = mongoose
