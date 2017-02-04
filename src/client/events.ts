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
}