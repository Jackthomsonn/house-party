/* eslint-disable no-console */
'use strict'
const express = require('express')
const app = express()
const request = require('request')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'development'
const enableLog = false
const socketList = []
const room = undefined
let mongoURI = null
let _id = null

server.listen(port)

mongoose.Promise = global.Promise

if(process.env.NODE_ENV === 'production') {
  mongoURI = process.env.MONGO_URI
  app.use(express.static(__dirname))
} else {
  mongoURI = 'mongodb://localhost/house_party/'
  app.use(express.static('dist'))
}

mongoose.connect(mongoURI)


app.use(bodyParser.json())
app.use('/api', require('./routes/music.js'))
app.use('/api', require('./routes/requests.js'))
app.use('/api', require('./routes/party.js'))

app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/views/index.html')
})

app.get('/player', (req, res) => {
  res.status(200).sendFile(__dirname + '/views/player/index.html')
})

app.get('/create', (req, res) => {
  res.status(200).sendFile(__dirname + '/views/create/index.html')
})


io.sockets.on('connection', (socket) => {
  _id = socket.id

  socket.on('joinRoom', (room) => {
    room = room
    socket.join(room)
    socketList.push({ id: _id, room: room })

    if(!enableLog) {
      return
    }

    showLog()
  })

  socket.on('songRequested', (data) => {
    io.sockets.in(data.shortName).emit('songRequested', data)
  })

  socket.on('songChanged', (data) => {
    io.sockets.in(data.shortName).emit('songChanged', data)
  })

  socket.on('disconnect', () => {
    socketList.splice(socketList[_id], 1)
    socket.leave(room)
  })
})

process.on('uncaughtException', (exception) => {
  try {
    throw new Error('An uncaught exception was initiated - ' + exception)
  } catch (e) {
    console.error(e)
  }
})

function showLog() {
  console.log('--------------- User List ---------------')
  console.log(JSON.stringify(socketList, null, 2))
  console.log('-----------------------------------------')
}