import Service from './services'
import View from './view'

export default class Player {
  constructor() {
    this.isPlaying = false
  }

  static play(callback) {
    let cache = null
    const audio = document.querySelector('audio')
    audio.autoplay = true
    Service.getSongs('/api/music/requests')
      .then( (songs) => {
        if(callback) {
          callback(songs)
        }
        if(songs.length > 0) {
          this.isPlaying = true
          cache = songs[0]
          audio.src = cache.link
          setInterval( () => {
            this.hasEnded(audio) ? this.next(cache) && (cache = null) : undefined
          }, 1000)
        } else {
          this.isPlaying = false
        }
      })
  }

  static hasEnded(audio) {
    return audio.duration === audio.currentTime
  }

  static next(cache) {
    if(cache) {
      Service.removeSong(cache._id)
        .then( (response) => {
          View.removeSongFromQueue()
          this.play()
        }).catch( (error) => {
          return error
        })
    }
  }
}