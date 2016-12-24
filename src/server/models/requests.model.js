const restful = require('node-restful')
const mongoose = restful.mongoose
const requestsSchema = new mongoose.Schema({
  _id: String,
  songName: String,
  artist: String,
  link: String
})

module.exports = restful.model('Requests', requestsSchema)