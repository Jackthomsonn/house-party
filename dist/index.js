/* eslint-disable no-console */
'use strict'
const express = require('express')
const app = express()
const request = require('request')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const enableLog = false

server.listen(3000)

mongoose.connect('mongodb://localhost/house_party/')

app.use(express.static('dist'))

app.use(bodyParser.json())
app.use('/api', require('./routes/music.js'))
app.use('/api', require('./routes/requests.js'))

app.get('/player', (req, res) => {
  res.status(200).sendFile(__dirname + '/player.html')
})

io.sockets.on('connection', function (socket) {
  const _id = socket.id
  enableLog ? showLog(_id, socket) : null
  socket.on('songRequested', (data) => {
    io.emit('songRequested', data)
  })
})

function showLog(_id, socket) {
  console.log('Socket Connected: ' + _id)
  socket.on('disconnect', () => { console.log('Socket Disconnected: ' + _id) })
}