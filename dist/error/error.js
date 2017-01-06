const express = require('express')
const app = express()

function ErrorHandler(res, statusCode, message) {
  res.status(statusCode).send(message)
}

module.exports = ErrorHandler