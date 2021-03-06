import { Services } from './services'
import { Settings } from './settings'
import { View } from './view'

export class Player {
  public static isPlaying: Boolean
  private view: View

  constructor() {
    this.view = new View()
  }

  public play(callback?: Function) {
    if (Services.partyId) {
      let cache: Interfaces.ICache
      let int: any;
      const audio: any = document.querySelector('audio')
      audio.setAttribute('autoplay', true)
      Services.getSongs('/api/music/requests')
        .then((songs: Array<Interfaces.ISongLink>) => {
          if (callback) {
            callback(songs)
          }
          if (songs.length > 0) {
            cache = songs[0]
            audio.src = cache.link
            int = setInterval(() => {
              if(this.hasEnded(audio)) {
                this.next(cache)
                cache = undefined
              }
            }, 1000)
          } else {
            Player.isPlaying = false
          }
        })
    }
  }

  private hasEnded(audio: Interfaces.ISong) {
    return audio.duration === audio.currentTime
  }

  private next(cache: Interfaces.ICache) {
    if (cache) {
      Services.removeSong(cache._id)
        .then(() => {
          Settings.socket.emit('songChanged', {
            changed: true,
            partyId: Services.partyId
          })
          this.view.removeSongFromQueue()
          this.play()
        }).catch((error: String) => {
          return error
        })
    }
    return
  }
}