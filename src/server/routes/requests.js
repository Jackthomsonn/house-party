'use strict'
const express = require('express')
const router = express.Router()
const Requests = require('../models/requests.model')

Requests.methods(['get', 'post', 'delete'])
Requests.register(router, '/music/requests')

module.exports = router