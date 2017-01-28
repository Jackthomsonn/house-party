import Service from './services'
import Notification from './notification'
import * as $ from 'jquery'

export default class View {
  private notification: Notification
  private parent: any

  constructor() {
    this.parent = $('.outer')
    this.notification = new Notification()
  }

  public makeList(songs: Array<Interfaces.ISongLink>) {
    songs.map( (song: Interfaces.ISong, index) => {
      this.parent.append(`<div class="card">
        <img src="${song.image}"></img>
        <div class="info">
          <p>${song.artist}</p>
          <p>${song.songName}</p>
        </div>
        <div class="actions">
          <button class="list">Request</button>
        </div>
      </div>`)

      const buttons: any = document.querySelectorAll('button.list')

      buttons.forEach( (button: any, index: any, curr: any) => {
        curr[index].addEventListener('click', () => {
          Service.requestSong(songs[index])
            .then( () => {
              return
            }).catch( (error) => {
              this.notification.show(error, true)
            })
        });
      })
    })
  }

  public songQueue(songs: Array<Interfaces.ISong>) {
    songs.map( (song: Interfaces.ISong, index) => {
      this.parent.append(`<div class="card">
        <img src="${song.image}"></img>
        <div class="info">
          <p>${song.artist}</p>
          <p>${song.songName}</p>
        </div>
      </div>`)
    })
  }

  public updateSongQueue(song: Interfaces.ISong) {
    this.parent.append(`<div class="card">
      <img src="${song.image}"></img>
      <div class="info">
        <p>${song.artist}</p>
        <p>${song.songName}</p>
      </div>
    </div>`
  )}

  public removeSongFromQueue() {
    this.parent.find('.card').first().remove()
  }
}