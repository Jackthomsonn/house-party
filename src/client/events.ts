import * as Promise from 'promise'
import Services from './services'
import View from './view'

export default class Events {
  private view: View

  constructor() {
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
}