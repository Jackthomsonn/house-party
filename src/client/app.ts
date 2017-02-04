import Events from './events'
import Notification from './notification'
import Player from './player'
import Service from './services'
import Settings from './settings'
import View from './view'

export default class App {
  private events: Events
  private notification: Notification
  private player: Player
  private view: View
  private viewList: any
  private closeList: any

  constructor() {
    this.events = new Events()
    this.notification = new Notification()
    this.player = new Player()
    this.view = new View()
    this.viewList = document.querySelector('.view-list')

    if (this.viewList) {
      this.closeList = document.querySelector('.close-list')
      this.viewList.addEventListener('click', this.events.getSongRequestsList)
      this.closeList.addEventListener('click', this.events.closeSongRequestList)
    }

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
    this.player.play((songs: Array<Interfaces.ISong>) => {
      this.view.songQueue(songs)
    })
  }

  private setupClient() {
    Service.getSongs()
      .then((songs: Array<Interfaces.ISongLink>) => {
        this.view.makeList(songs)
      })
  }
}

new App()