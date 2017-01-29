import Notification from './notification'
import Player from './player'
import Service from './services'
import Settings from './settings'
import View from './view'

export default class App {
  private view: View
  private player: Player
  private notification: Notification

  constructor() {
    this.view = new View()
    this.player = new Player()
    this.notification = new Notification()

    Settings.init()
    Settings.isPlayer() ? this.setupPlayer() : this.setupClient()
    Settings.socket.on('songRequested', (song: Interfaces.ISong) => {
      if (!Settings.isPlayer()) {
        this.notification.show(song)
      } else {
        this.view.updateSongQueue(song)
        if (!this.player.isPlaying) {
          this.player.play()
        }
      }
    })
  }

  private setupPlayer() {
    this.player.play( (songs: Array<Interfaces.ISong>) => {
      this.view.songQueue(songs)
    })
  }

  private setupClient() {
    Service.getSongs()
      .then( (songs: Array<Interfaces.ISongLink>) => {
        this.view.makeList(songs)
      })
  }
}

new App()