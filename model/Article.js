const mongoose = require('./')
const articleSchema = mongoose.Schema({
    title: {
        type: String,
        validate: {
            validator(v) {
                return v.length > 4
            },
            message: '标题长度不能小于5'
        },
        required: true
    },
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: {}
})

module.exports = mongoose.model('Article', articleSchema)