import Service from './services'
import View from './view'
import Settings from './settings'
import Notification from './notification'
import Player from './player'

export default class App {
  constructor() {
    Settings.init()
    Settings.isPlayer() ? this.setupPlayer() : this.setupClient()
    Settings.socket.on('songRequested', (data) => {
      if(!Settings.isPlayer()) {
        Notification.show(data)
      } else {
        View.updateSongQueue(data)
        if(!Player.isPlaying) {
          Player.play()
        }
      }
    })
  }

  setupPlayer() {
    Player.play(function(songs) {
      View.songQueue(songs)
    })
  }

  setupClient() {
    Service.getSongs().then( (songs) => { View.makeList(songs) })
  }
}

new App()