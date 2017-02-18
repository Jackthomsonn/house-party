'use strict'
const express = require('express')
const router = express.Router()
const Party = require('../models/party.model')

Party.methods(['get', 'post', 'delete'])
Party.register(router, '/house-parties')

module.exports = router