import * as Promise from 'promise'
import Notification from './notification'
import Player from './player'
import Services from './services'
import Settings from './settings'
import View from './view'

export default class Events {
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
    }).then((result: Interfaces.IHouseParty) => {
      this.view.showCreatedParty(result)
      this.notification.show(`${result.name} was successfully created`, true)
    }).catch((error) => {
      this.notification.show(`${error}`, true)
    })
  }

  public joinParty = () => {
    Services.partyId = this.partyId
    Settings.socket.emit('joinRoom', this.partyId)
    Services.getPartyName(this.partyId)
      .then((partyName: String) => {
        this.partyName = partyName
        this.view.updateHeader(partyName)
      })
    Services.partyExists((exists: Boolean) => {
      if (exists) {
        this.view.closeSplash()
        this.getCurrentSong()
        this.notification.show(`You have successfully connected to ${this.partyName}`, true)
        Services.getSongs()
          .then((songs: Array<Interfaces.ISongLink>) => {
            this.view.makeList(songs)
            this.player.play()
          })
      } else {
        this.notification.show(`It looks like that party doesn't exist. Please make sure the ID you have supplied is correct`, true)
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
        this.notification.show(`Party successfully started`, true)
      } else {
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

  public getUsername(e: any) {
    Services.username = e.srcElement.value
  }

  public copyCode(e: any) {
    window.getSelection().removeAllRanges();
    const code = document.querySelector('.code');
    const range = document.createRange();
    range.selectNode(code);
    window.getSelection().addRange(range);
    try {
      document.execCommand('copy');
    } catch (err) {
      return err
    }
  }
}