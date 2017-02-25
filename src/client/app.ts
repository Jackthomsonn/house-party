import { Events } from './events'
import { Notification } from './notification'
import { Player } from './player'
import { Services } from './services'
import { Settings } from './settings'
import { View } from './view'

export class App {
  private events: Events
  private notification: Notification
  private player: Player
  private view: View

  constructor() {
    this.events = new Events()
    this.notification = new Notification()
    this.player = new Player()
    this.view = new View()
    this.setupEventListeners()
    this.setupSockets()
  }

  private setupSockets() {
    Settings.init()
      .then(() => {
        Settings.socket.on('songChanged', () => this.events.getCurrentSong())
        Settings.socket.on('songRequested', (song: Interfaces.ISong) => this.songRequest(song))
        Settings.socket.on('updateCount', (online: Number) => this.updateCount(online))
        Settings.socket.on('disconnect', () => this.disconnect())
        Settings.socket.on('reconnect', () => this.attemptReconnection())
      })
  }

  private attemptReconnection() {
    if (this.view.joinParty) {
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
  }

  private disconnect() {
    this.view.showLoader()
    this.notification.show('Connection to the party has been lost, reconnecting..', true, false)
  }

  private setupEventListeners() {
    if (this.view.viewList) {
      this.view.closeList.addEventListener('click', this.events.closeSongRequestList)
      this.view.search.addEventListener('input', this.events.search)
      this.view.viewList.addEventListener('click', this.events.getSongRequestsList)
      this.view.clearSearchField.addEventListener('click', this.events.clearSearch)
    }

    if (this.view.createParty) {
      this.view.createParty.addEventListener('click', this.events.createParty)
      this.view.partyName.addEventListener('input', this.events.setPartyName)
      this.view.copyCode.addEventListener('click', this.events.copyCode)
    }

    if (this.view.startParty) {
      this.view.startParty.addEventListener('click', this.events.startParty)
    }

    if (this.view.joinParty) {
      this.view.joinParty.addEventListener('click', this.events.joinParty)
      this.view.userName.addEventListener('input', this.events.getUsername)
    }

    if (!this.view.createParty) {
      this.view.partyId.addEventListener('input', this.events.setPartyId)
    }

  }

  private songRequest(song: Interfaces.ISong) {
    if (Settings.isPlayer()) {
      this.view.updateSongQueue(song)
      if (!this.player.isPlaying) {
        this.player.isPlaying = true
        this.player.play()
      }
      return
    }

    this.events.getCurrentSong()
    this.requestingSocket(song)
    this.notification.show(song)
  }

  private requestingSocket(song: Interfaces.ISong) {
    song.username === Services.username ? song.username = 'You' : undefined
  }

  private updateCount(online: Number) {
    if (this.view.onlineCount) {
      this.view.updateCount(online)
    }
    return
  }
}

new App()