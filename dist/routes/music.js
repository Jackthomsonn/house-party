'use strict'
const express = require('express')
const router = express.Router()
const Music = require('../models/music.model')

Music.methods(['get', 'post', 'delete'])
Music.register(router, '/music')

module.exports = router