import * as Promise from 'promise'
import Player from './player'
import Services from './services'
import Settings from './settings'
import View from './view'

export default class Events {
  private player: Player
  private view: View
  private partyName: String
  private partyId: String

  constructor() {
    this.player = new Player()
    this.view = new View()
  }

  public getSongRequestsList = () => {
    Services.getSongs('/api/music/requests')
      .then((songs: Array<Interfaces.ISongLink>) => {
        this.view.showSongRequestList(songs)
      })
  }

  public closeSongRequestList = () => {
    this.view.closeSongRequestList()
  }

  public search = (e: any) => {
    const value = e.srcElement.value
    value.length > 0 ? this.view.clearSearch(true) : this.view.clearSearch(false)
    Services.getSongs('/api/music?q=' + value)
      .then((songs: Array<Interfaces.ISongLink>) => {
        this.view.makeList(songs, true)
      })
  }

  public clearSearch = (e: any) => {
    Services.getSongs('/api/music')
      .then((songs: Array<Interfaces.ISongLink>) => {
        this.view.makeList(songs, true)
        e.srcElement.previousElementSibling.value = ''
        this.view.clearSearch(false)
      })
  }

  public setPartyName = (e: any) => {
    this.partyName = e.srcElement.value
  }

  public setPartyId = (e: any) => {
    this.partyId = e.srcElement.value
  }

  public createParty = () => {
    Services.createParty({
      name: this.partyName
    }).then((result) => {
      return result
    }).catch((error) => {
      return error
    })
  }

  public joinParty = () => {
    Services.partyId = this.partyId
    Settings.socket.emit('joinRoom', this.partyId)
    Services.partyExists((exists: Boolean) => {
      if (exists) {
        this.view.closeSplash()
        this.getCurrentSong()
        Services.getSongs()
          .then((songs: Array<Interfaces.ISongLink>) => {
            this.view.makeList(songs)
            this.player.play()
          })
        return
      }
    })
  }

  public startParty = () => {
    Services.partyId = this.partyId
    Settings.socket.emit('joinRoom', this.partyId)
    Services.partyExists((exists: Boolean) => {
      if (exists) {
        this.view.closeSplash()
        Services.getSongs('/api/music/requests')
          .then((songs: Array<Interfaces.ISongLink>) => {
            this.view.songQueue(songs)
          })
      }
    })
  }

  public getCurrentSong() {
    if (Services.partyId) {
      Services.getSongs('/api/music/requests')
        .then((songs) => {
          this.view.setCurrentSong(songs)
        })
    }
  }
}