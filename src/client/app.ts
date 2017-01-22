import Service from './services'
import View from './view'
import Settings from './settings'
import Notification from './notification'
import Player from './player'

export default class App {
  public view: View
  public player: Player
  public notification: Notification

  constructor() {
    this.view = new View()
    this.player = new Player()
    this.notification = new Notification()

    Settings.init()
    Settings.isPlayer() ? this.setupPlayer() : this.setupClient()
    Settings.socket.on('songRequested', (song: Interfaces.ISong) => {
      if(!Settings.isPlayer()) {
        this.notification.show(song)
      } else {
        this.view.updateSongQueue(song)
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