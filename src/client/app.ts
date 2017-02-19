import Events from './events'
import Notification from './notification'
import Player from './player'
import Service from './services'
import Settings from './settings'
import View from './view'

export default class App {
  private closeList: any
  private clearSearch: any
  private events: Events
  private notification: Notification
  private player: Player
  private search: any
  private view: View
  private viewList: any

  // All inputs
  private partyId: any

  // Create Screen
  private createParty: any
  private partyName: any
  private copyCode: any

  // Main Screen
  private joinParty: any
  private userName: any

  // Player Screen
  private startParty: any

  constructor() {
    this.closeList = document.querySelector('.close-list')
    this.clearSearch = document.querySelector('.close')
    this.copyCode = document.querySelector('.copy-code')
    this.events = new Events()
    this.notification = new Notification()
    this.player = new Player()
    this.search = document.querySelector('.search')
    this.view = new View()
    this.viewList = document.querySelector('.view-list')

    // Use for all inputs
    this.partyId = document.querySelector('.party-id')

    // Create Screen
    this.createParty = document.querySelector('.create-party')
    this.partyName = document.querySelector('.party-name')

    // Main Screen
    this.joinParty = document.querySelector('.join-party')
    this.userName = document.querySelector('.user-name')

    // Player Screen
    this.startParty = document.querySelector('.start-party')

    this.setupEventListeners()
    this.setupSockets()
  }

  private setupSockets() {
    Settings.init()
      .then(() => {
        Settings.isPlayer() ? this.setupPlayer() : this.setupClient()
        Settings.socket.on('songChanged', () => {
          this.events.getCurrentSong()
        })
        Settings.socket.on('songRequested', (song: Interfaces.ISong) => {
          if (Settings.isPlayer()) {
            this.view.updateSongQueue(song)
            if (!this.player.isPlaying) {
              this.player.isPlaying = true
              this.player.play()
            }
            return
          }
          this.events.getCurrentSong()

          if (song.username === Service.username) {
            song.username = 'You'
          }

          this.notification.show(song)
        })
      })
  }

  private setupPlayer() {
    this.player.play((songs: Array<Interfaces.ISong>) => {
      this.view.songQueue(songs)
    })
  }

  private setupClient() {
    if (Service.partyId) {
      Service.getSongs()
        .then((songs: Array<Interfaces.ISongLink>) => {
          this.view.makeList(songs)
        })
    }
  }

  private setupEventListeners() {
    if (this.viewList) {
      this.closeList.addEventListener('click', this.events.closeSongRequestList)
      this.search.addEventListener('input', this.events.search)
      this.viewList.addEventListener('click', this.events.getSongRequestsList)
      this.clearSearch.addEventListener('click', this.events.clearSearch)
    }

    // Create Screen
    if (this.createParty) {
      this.createParty.addEventListener('click', this.events.createParty)
      this.partyName.addEventListener('input', this.events.setPartyName)
      this.copyCode.addEventListener('click', this.events.copyCode)
    }

    // Player Screen
    if (this.startParty) {
      this.startParty.addEventListener('click', this.events.startParty)
    }

    // Main Screen
    if (this.joinParty) {
      this.joinParty.addEventListener('click', this.events.joinParty)
      this.userName.addEventListener('input', this.events.getUsername)
    }

    // Main Screen And Player Screen
    if (!this.createParty) {
      this.partyId.addEventListener('input', this.events.setPartyId)
    }

  }
}

new App()