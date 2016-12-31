'use strict'
const express = require('express')
const router = express.Router()
const request = require('request')
const CLIENT_ID = process.env.CLIENT_ID

router.get('/music', (req, res) => {
  const options = {
    url: 'http://api.soundcloud.com/playlists/287765171?' + CLIENT_ID,
    method: req.method
  }
  request(options, (error, response, body) => {
    const tracks = []
    const responseBody = JSON.parse(body)
    responseBody.tracks.map( (track) => {
      tracks.push({
        id: track.id,
        image: track.artwork_url,
        link: track.stream_url +  '?' + CLIENT_ID,
        songName: track.title,
        artist: track.user.username
      })
    })
    res.status(200).send(tracks)
  })
})

module.exports = router