'use strict'
const express = require('express')
const router = express.Router()

router.get('/settings', (req, res) => {
  if(process.env.NODE_ENV === 'production') {
    return res.status(200).send('http://house-party.io/')
  }
  return res.status(200).send('http://localhost:3000')
})

module.exports = router