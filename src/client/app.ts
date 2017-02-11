import Events from './events'
import Notification from './notification'
import Player from './player'
import Service from './services'
import Settings from './settings'
import View from './view'

export default class App {
  private closeList: any
  private events: Events
  private notification: Notification
  private player: Player
  private search: any
  private view: View
  private viewList: any

  constructor() {
    this.closeList = document.querySelector('.close-list')
    this.events = new Events()
    this.notification = new Notification()
    this.player = new Player()
    this.search = document.querySelector('.search')
    this.view = new View()
    this.viewList = document.querySelector('.view-list')

    this.setupEventListeners()
    this.getCurrentSong()
    this.setupSockets()
  }

  private getCurrentSong() {
    Service.getSongs('/api/music/requests')
      .then((songs) => {
        this.view.setCurrentSong(songs)
      })
  }

  private setupSockets() {
    Settings.init()
    Settings.isPlayer() ? this.setupPlayer() : this.setupClient()
    Settings.socket.on('songChanged', () => {
      Service.getSongs('/api/music/requests')
        .then((songs) => {
          this.view.setCurrentSong(songs)
        })
    })

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

  private setupEventListeners() {
    if (this.viewList) {
      this.closeList.addEventListener('click', this.events.closeSongRequestList)
      this.search.addEventListener('input', this.events.search)
      this.viewList.addEventListener('click', this.events.getSongRequestsList)
    }
  }
}

new App()