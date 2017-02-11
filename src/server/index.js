/* eslint-disable no-console */
'use strict'
const express = require('express')
const app = express()
const request = require('request')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const port = process.env.port || 3000
const env = process.env.NODE_ENV || 'development'
const socketObj = {}
const socketList = []
let _id = null

server.listen(3000)

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/house_party/')

app.use(express.static('dist'))
app.use(bodyParser.json())
app.use('/api', require('./routes/music.js'))
app.use('/api', require('./routes/requests.js'))

app.get('/player', (req, res) => {
  res.status(200).sendFile(__dirname + '/player.html')
})

io.sockets.on('connection', (socket) => {
  _id = socket.id
  let obj = null
  socketList.length === 0 ? obj = { role: 'player' } : obj = { role: 'client' }

  if (!obj) {
    return
  }

  socketObj[_id] = obj
  socketList.push(socketObj)

  socket.on('disconnect', () => {
    socketList.splice(socketList[_id], 1)
  })

  socket.on('songRequested', (data) => {
    io.emit('songRequested', data)
  })

  socket.on('songChanged', (data) => {
    io.emit('songChanged', data)
  })
})

process.on('uncaughtException', (exception) => {
  try {
    throw new Error('An uncaught exception was initiated - ' + exception)
  } catch (e) {
    console.error(e)
  }
})