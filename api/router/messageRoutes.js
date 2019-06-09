const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Message = require('../models/messages')

// get all the messages
router.get('/viewMessages', (req, res) => {
    Message.find()
    .exec()
    .then(result => {
        if(result.length > 0) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json({message: 'no data found'})
        }
    })
    .catch(err => {
        console.log("error ->", err)
        res.status(500).json({
            error: err
        })
    })
})

//post a message

router.post('/addMessage', (req,res,next) => {
var messageData = new Message({
    _id: mongoose.Types.ObjectId(),
    username: req.body.name,
    message: req.body.message
})

var io =  req.io;
io.emit("new message", req.body)
messageData.save()
.then(result => {
    res.status(201).json({
        message: 'data inserted successfully',
        result: result
    })
})
.catch(err => {
console.log("error", err)
error: err
})

})


module.exports = router