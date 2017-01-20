import Service from './services'
import View from './view'
import Settings from './settings'
import Notification from './notification'
import Player from './player'

export default class App {
  public view: View
  public player: Player

  constructor() {
    this.view = new View()
    this.player = new Player()

    Settings.init()
    Settings.isPlayer() ? this.setupPlayer() : this.setupClient()
    Settings.socket.on('songRequested', (song: Interfaces.ISong) => {
      if(!Settings.isPlayer()) {
        Notification.show(song)
      } else {
        this.view.updateSongQueue(song)
      }
      if(!this.player.isPlaying) {
        this.player.play()
      }
    })
  }

  setupPlayer() {
    this.player.play( (songs: Array<Interfaces.ISong>) => {
      this.view.songQueue(songs)
    })
  }

  setupClient() {
    Service.getSongs()
      .then( (songs: Array<Interfaces.ISongLink>) => {
        this.view.makeList(songs)
      })
  }
}

new App()