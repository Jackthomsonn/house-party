const restful = require('node-restful')
const mongoose = restful.mongoose
const musicSchema = new mongoose.Schema({
  songName: String,
  artist: String,
  link: String
})

module.exports = restful.model('Music', musicSchema, 'music')