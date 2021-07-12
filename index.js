const express = require('express')
const app = express()
const port = 3030
const fs = require('fs')
const bodyParser = require('body-parser')
const ApiUser = require('./api/users')
const ApiFarm = require('./api/farm')
const ApiProducts = require('./api/products')
const ApiImages = require('./api/images')
const ApiChatRooms = require('./api/chatroom')
const ApiMessage = require('./api/message')

app.use(express.static('./'))
app.use(bodyParser.json({ limit: '30MB' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res)=>{
  res.send('hello')
})

app.get('/images/:id', (req, res) => {
    res.sendFile('./images/' + req.params.id);
    
})

app.use('/api',[ApiUser,ApiFarm,ApiProducts,ApiImages,ApiChatRooms,ApiMessage])

app.listen(port)
