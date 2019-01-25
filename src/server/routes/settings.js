'use strict'
const express = require('express')
const router = express.Router()

router.get('/settings', (req, res) => {
  if(process.env.NODE_ENV === 'production') {
    return res.status(200).send('https://house-party.herokuapp.com/')
  }
  return res.status(200).send(process.env.LOCAL_HOST)
})

module.exports = router
