const mongoose = require('mongoose')
const messagesSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    username: String,
    message: String
})

module.exports = mongoose.model('Message', messagesSchema)