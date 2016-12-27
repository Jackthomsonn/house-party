import Service from './services'
import Notification from './notification'
import $ from 'jquery'

const parent = $('.outer')

export default class View {
  static makeList(songs) {
    songs.map( (song, index) => {
      parent.append(`<div class="card">
        <img src="${song.image}"></img>
        <div class="info">
          <p>${song.artist}</p>
          <p>${song.songName}</p>
        </div>
        <div class="actions">
          <button class="list">Request</button>
        </div>
      </div>`)
      const buttons = document.querySelectorAll('button.list')
      buttons.forEach( (button, index, curr) => {
        curr[index].addEventListener('click', () => {
          Service.requestSong(songs[index])
            .then( (response) => {
              return response
            }).catch( (error) => {
              Notification.show(error, true)
            })
        });
      })
    })
  }

  static songQueue(songs) {
    songs.map( (song, index) => {
      parent.append(`<div class="card">
        <img src="${song.image}"></img>
        <div class="info">
          <p>${song.artist}</p>
          <p>${song.songName}</p>
        </div>
      </div>`)
    })
  }

  static updateSongQueue(song) {
    parent.append(`<div class="card">
      <img src="${song.image}"></img>
      <div class="info">
        <p>${song.artist}</p>
        <p>${song.songName}</p>
      </div>
    </div>`
  )}

  static removeSongFromQueue() {
    parent.find('.card').first().remove()
  }
}