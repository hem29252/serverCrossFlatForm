const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3029

app.get('/', (req, res) => {
  res.send('Hello World.')
})

http.listen(port)

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg)
    console.log(msg)
  })
})
