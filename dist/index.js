/* eslint-disable no-console */
'use strict'
const express = require('express')
const app = express()
const request = require('request')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const routing = require('./routing')
const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || 'development'
const socketList = []
const enableLog = false
const room = undefined
let mongoURI = undefined
let _id = undefined

server.listen(port)

setupEnvironment(app)

errorHandler()

routing.route(app)

app.use(bodyParser.json())
app.use('/api', require('./routes/music.js'))
app.use('/api', require('./routes/requests.js'))
app.use('/api', require('./routes/party.js'))
app.use('/api', require('./routes/settings.js'))

io.sockets.on('connection', (socket) => {
  _id = socket.id

  socket.on('joinRoom', (room) => {
    socket.room = room
    socket.join(room)
    socketList.push({ id: _id, room: room })

    updateCount(room)

    if (!enableLog) {
      return
    }

    showLog()
  })

  socket.on('songRequested', (data) => {
    io.sockets.in(data.partyId).emit('songRequested', data)
  })

  socket.on('songChanged', (data) => {
    io.sockets.in(data.partyId).emit('songChanged', data)
  })

  socket.on('disconnect', () => {
    updateCount(socket.room)
    socketList.splice(socketList[_id], 1)
    socket.leave(room)
  })
})

function updateCount(room) {
  if (!room || !io.sockets.adapter.rooms[room]) {
    return
  }

  const clients = io.sockets.adapter.rooms[room].sockets
  const numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length - 1 : 0

  for (const clientId in clients) {
    const clientSocket = io.sockets.connected[clientId]
    clientSocket.emit('updateCount', numClients)
  }
}

function showLog() {
  console.log('--------------- User List ---------------')
  console.log(JSON.stringify(socketList, undefined, 2))
  console.log('-----------------------------------------')
}

function setupEnvironment() {
  if (process.env.NODE_ENV === 'production') {
    mongoURI = process.env.MONGO_URI
    app.use(express.static(__dirname))
  } else {
    mongoURI = 'mongodb://localhost/house_party/'
    app.use(express.static('dist'))
  }
  mongoose.Promise = global.Promise
  mongoose.connect(mongoURI)
}

function errorHandler() {
  process.on('uncaughtException', (exception) => {
    try {
      throw new Error('An uncaught exception was initiated - ' + exception)
    } catch (e) {
      console.error(e)
    }
  })
}