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
    Settings.socket.on('songRequested', (data: any) => {
      if(!Settings.isPlayer()) {
        Notification.show(data)
      } else {
        this.view.updateSongQueue(data)
      }
      if(!this.player.isPlaying) {
        this.player.play()
      }
    })
  }

  setupPlayer() {
    this.player.play( (songs: any) => {
      this.view.songQueue(songs)
    })
  }

  setupClient() {
    Service.getSongs()
      .then( (songs: any) => {
        this.view.makeList(songs)
      })
  }
}

new App()