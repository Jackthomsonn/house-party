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
const port = process.env.port || 3000
const env = process.env.NODE_ENV || 'development'

server.listen(3000)

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/house_party/')

app.use(express.static('dist'))

app.use(bodyParser.json())
app.use('/api', require('./routes/music.js'))
app.use('/api', require('./routes/requests.js'))

let sockets = {}
let socketList = []
let _id = null

app.get('/player', (req, res, next) => {
  res.status(200).sendFile(__dirname + '/player.html')
  socketList.map((socket) => {
    if (socket[_id].role === 'client') {
      res.redirect('/')
    }
  })
})

io.sockets.on('connection', (socket) => {
  _id = socket.id
  let obj = null
  socketList.length === 0 ? obj = { role: 'player' } : obj = { role: 'client' }

  if (!obj) {
    return
  }

  sockets[_id] = obj
  socketList.push(sockets)

  socket.on('disconnect', () => {
    socketList.splice(socketList[_id], 1)
    enableLog ? showLog(_id, socket) : null
  })

  socket.on('songRequested', (data) => {
    io.emit('songRequested', data)
  })

  enableLog ? showLog(_id, socket) : null
})

function showLog(_id, socket) {
  console.log('-----------------')
  console.log('House party is running in ' + env + ' mode on port ' + port)
  console.log('-----------------')
  console.log('Connected Clients (' + socketList.length + ')')
  console.log(socketList)
  console.log('-----------------')
}
