const restful = require('node-restful')
const mongoose = restful.mongoose
const partySchema = new mongoose.Schema({
  name: String,
  partyId: String,
  partyId: String
})

module.exports = restful.model('Party', partySchema)