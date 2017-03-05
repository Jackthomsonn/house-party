import * as Promise from 'promise'
import { Notification } from './notification'
import { Player } from './player'
import { Services } from './services'
import { Settings } from './settings'
import { View } from './view'

export class Events {
  public username: String

  private notification: Notification
  private player: Player
  private view: View
  private partyName: String
  private partyId: String

  constructor() {
    this.notification = new Notification()
    this.player = new Player()
    this.view = new View()
  }

  public getSongRequestsList = () => {
    Services.getSongs('/api/music/requests')
      .then((songs: Array<Interfaces.ISongLink>) => {
        this.view.showSongRequestList(songs)
      })
  }

  public search = (e: any) => {
    this.view.showLoader()
    const value = e.srcElement.value
    value.length > 0 ? this.view.clearSearch(true) : this.view.clearSearch(false)
    Services.getSongs('/api/music?q=' + value)
      .then((songs: Array<Interfaces.ISongLink>) => {
        this.view.hideLoader()
        this.view.makeList(songs, true)
      })
  }

  public clearSearch = (e: any) => {
    this.view.showLoader()
    Services.getSongs('/api/music')
      .then((songs: Array<Interfaces.ISongLink>) => {
        e.srcElement.previousElementSibling.value = ''
        this.view.hideLoader()
        this.view.clearSearch(false)
        this.view.makeList(songs, true)
      })
  }

  public createParty = () => {
    this.view.showLoader()
    Services.createParty({
      name: this.partyName
    }).then((result: Interfaces.IHouseParty) => {
      this.view.showCreatedParty(result)
      this.notification.show(`${result.name} was successfully created`, true)
      this.view.hideLoader()
    }).catch((error) => {
      this.notification.show(`${error}`, true)
      this.view.hideLoader()
    })
  }

  public joinParty = (e: any) => {
    this.view.showLoader()
    Services.partyId = this.partyId
    Services.partyExists((exists: Boolean) => {
      if (exists) {
        Settings.socket.emit('joinRoom', this.partyId)
        Services.getPartyName(this.partyId)
          .then((partyName: String) => {
            this.partyName = partyName
            this.view.updateHeader(partyName)
            Services.getSongs()
              .then((songs: Array<Interfaces.ISongLink>) => {
                if (!e.hasReconnected) {
                  this.notification.show(`You have successfully connected to ${this.partyName}`, true)
                  this.view.closeSplash()
                } else {
                  this.notification.show(`You have successfully been reconnected to ${this.partyName}`, true)
                }
                this.getCurrentSong()
                this.view.hideLoader()
                this.view.makeList(songs)
                this.player.play()
              })
          })
      } else {
        this.view.hideLoader()
        this.notification.show(`It looks like that party doesn't exist. Please make sure the ID you have supplied is correct`, true)
      }
    })
  }

  public startParty = (e: any) => {
    if (this.getParam()) {
      this.partyId = this.getParam()
    }
    this.view.showLoader()
    Services.partyId = this.partyId
    Settings.socket.emit('joinRoom', this.partyId)
    this.view.showPartyId(this.partyId)
    Services.partyExists((exists: Boolean) => {
      if (exists) {
        if (!e.hasReconnected) {
          this.view.closeSplash()
        }
        Services.getSongs('/api/music/requests')
          .then((songs: Array<Interfaces.ISongLink>) => {
            this.view.hideLoader()
            this.view.songQueue(songs)
            if (!e.hasReconnected) {
              this.notification.show(`Party successfully started`, true)
            } else {
              this.notification.show(`Party successfully reconnected`, true)
            }
          })

        Services.getPartyName(this.partyId)
          .then((partyName: String) => {
            this.view.hideLoader()
            this.partyName = partyName
            this.view.updateHeader(partyName)
          })
      } else {
        this.view.hideLoader()
        this.notification.show(`It looks like that party doesn't exist. Please make sure the ID you have supplied is correct`, true)
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

  public getUsername = (e: any) => {
    Services.username = e.srcElement.value
  }

  public copyCode = () => {
    window.getSelection().removeAllRanges()
    const code = document.querySelector('.code')
    const range = document.createRange()
    range.selectNode(code)
    window.getSelection().addRange(range)
    try {
      document.execCommand('copy')
      this.notification.show(`Party ID successfully copied to clipboard <a href='../player?partyid=${code.innerHTML}
      '>Start party</a>`, true, false)
    } catch (err) {
      this.notification.show('There was an error when trying to copy the party ID to your clipboard', true)
    }
  }

  public getParam() {
    return location.search.split('=').pop()
  }

  public closeSongRequestList = () => {
    this.view.closeSongRequestList()
  }

  public setPartyName = (e: any) => {
    this.partyName = e.srcElement.value
  }

  public setPartyId = (e: any) => {
    this.partyId = e.srcElement.value
  }
}
