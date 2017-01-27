import Service from './services'
import View from './view'
import Settings from './settings'

export default class Player {
  public isPlaying: Boolean
  private view: View

  constructor() {
    this.isPlaying = false
    this.view = new View()
  }

  public play(callback?: Function) {
    let cache: Interfaces.ICache = null
    const audio: any = document.querySelector('audio')
    audio.setAttribute('autoplay', true);
    Service.getSongs('/api/music/requests')
      .then( (songs: Array<Interfaces.ISongLink>) => {
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

  private hasEnded(audio: Interfaces.ISong) {
    return audio.duration === audio.currentTime
  }

  private next(cache: Interfaces.ICache) {
    if(cache) {
      Service.removeSong(cache._id)
        .then( () => {
          this.view.removeSongFromQueue()
          this.play()
        }).catch( (error: String) => {
          return error
        })
    }
  }
}