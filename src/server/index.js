/* eslint-disable no-console */
'use strict'
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

server.listen(3000)

mongoose.connect('mongodb://localhost/house_party/')

app.use(express.static('dist'))

app.use(bodyParser.json())
app.use('/api', require('./routes/music.js'))
app.use('/api', require('./routes/requests.js'))

io.sockets.on('connection', function (socket) {
  const _id = socket.id
  console.log('Socket Connected: ' + _id)
  socket.on('disconnect', () => {
    console.log('Socket Disconnected: ' + _id)
  })
  socket.on('songRequested', (data) => {
    io.emit('songRequested', data)
  })
})