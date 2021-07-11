const express = require('express')
const app = express()
const port = 3030

const ApiUser = require('./api/users')
const ApiFarm = require('./api/farm')
const ApiProducts = require('./api/products')
const ApiImages = require('./api/images')
const ApiChatRooms = require('./api/chatroom')
const ApiMessage = require('./api/message')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res)=>{
  res.send('hello')
})

app.use('/api',[ApiUser,ApiFarm,ApiProducts,ApiImages,ApiChatRooms,ApiMessage])

app.listen(port)
