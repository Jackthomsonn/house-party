import Service from './services'
import View from './view'

export default class Player {
  public isPlaying: any
  public view: any
  public service: any

  constructor() {
    this.isPlaying = false
    this.view = new View()
    this.service = new Service();
  }

  public play(callback?: Function) {
    let cache: Interfaces.ICache = null
    const audio = document.querySelector('audio')
    audio.autoplay = true
    this.service.getSongs('/api/music/requests')
      .then( (songs: any) => {
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

  public hasEnded(audio: Interfaces.IAudio) {
    return audio.duration === audio.currentTime
  }

  public next(cache: Interfaces.ICache) {
    if(cache) {
      this.service.removeSong(cache._id)
        .then( (response: Object) => {
          this.view.removeSongFromQueue()
          this.play()
        }).catch( (error: Object) => {
          return error
        })
    }
  }
}