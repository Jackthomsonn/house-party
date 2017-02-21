import Events from './events'
import Notification from './notification'
import Player from './player'
import Service from './services'
import Settings from './settings'
import View from './view'

export default class App {
  private closeList: any
  private clearSearch: any
  private createParty: any
  private copyCode: any
  private events: Events
  private joinParty: any
  private notification: Notification
  private player: Player
  private partyId: any
  private partyName: any
  private search: any
  private startParty: any
  private userName: any
  private view: View
  private viewList: any

  constructor() {
    this.closeList = document.querySelector('.close-list')
    this.clearSearch = document.querySelector('.close')
    this.copyCode = document.querySelector('.copy-code')
    this.createParty = document.querySelector('.create-party')
    this.events = new Events()
    this.joinParty = document.querySelector('.join-party')
    this.notification = new Notification()
    this.partyId = document.querySelector('.party-id')
    this.partyName = document.querySelector('.party-name')
    this.player = new Player()
    this.search = document.querySelector('.search')
    this.startParty = document.querySelector('.start-party')
    this.userName = document.querySelector('.user-name')
    this.view = new View()
    this.viewList = document.querySelector('.view-list')

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

        Settings.socket.on('updateCount', (online: any) => {
          this.view.updateCount(online)
        })

        Settings.socket.on('disconnect', () => {
          this.view.showLoader()
          this.notification.show('Connection to the party has been lost, reconnecting..', true, false)
        })

        Settings.socket.on('reconnect', () => {
          if (this.joinParty) {
            this.events.joinParty({
              hasReconnected: true
            })
            this.view.hideLoader()
            this.notification.hide()
          } else {
            this.events.startParty({
              hasReconnected: true
            })
          }
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

    if (this.createParty) {
      this.createParty.addEventListener('click', this.events.createParty)
      this.partyName.addEventListener('input', this.events.setPartyName)
      this.copyCode.addEventListener('click', this.events.copyCode)
    }

    if (this.startParty) {
      this.startParty.addEventListener('click', this.events.startParty)
    }

    if (this.joinParty) {
      this.joinParty.addEventListener('click', this.events.joinParty)
      this.userName.addEventListener('input', this.events.getUsername)
    }

    if (!this.createParty) {
      this.partyId.addEventListener('input', this.events.setPartyId)
    }

  }
}

new App()