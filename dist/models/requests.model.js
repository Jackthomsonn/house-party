const restful = require('node-restful')
const mongoose = restful.mongoose
const requestsSchema = new mongoose.Schema({
  songName: String,
  artist: String,
  link: String,
  image: String
})

module.exports = restful.model('Requests', requestsSchema)