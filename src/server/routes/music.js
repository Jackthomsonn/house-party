'use strict'
const contains = require('string-contains-string')
const CLIENT_ID = process.env.CLIENT_ID
const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/music', (req, res) => {
  const q = req.query.q
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
    let results = []
    if(req.query.q) {
      tracks.find( (track) => {
        contains(q, track.artist) ||
        contains(q, track.songName) ||
        contains(q, track.artist.toLowerCase()) ||
        contains(q, track.songName.toLowerCase()) ? results.push(track) : undefined
      })
    } else {
      results = tracks
    }
    res.status(200).send(results)
  })
})

module.exports = router