import Settings from './settings'
import Service from './services'

export default class View {
  static makeList(songs) {
    const parent = document.querySelector('.outer')
    songs.map( (song) => {
      parent.innerHTML += `<div class="card">
        <img src="https://images-na.ssl-images-amazon.com/images/I/81iC%2BO0ec2L._SL1448_.jpg"></img>
        <div class="info">
          <p>${song.artist}</p>
          <p>${song.songName}</p>
        </div>
        <div class="actions">
          <button>Request</button>
        </div>
      </div>`
      const buttons = document.querySelectorAll('button')
      buttons.forEach( (button, index, curr) => {
        curr[index].addEventListener('click', () => { this.requestSong(songs[index]) });
      })
    })
  }
  static requestSong(songToRequest) {
    Settings.socket.emit('songRequested', {
      artist: songToRequest.artist,
      songName: songToRequest.songName
    })
    Service.requestSong(songToRequest)
      .then( (response) => { return response })
      .catch( (error) => { return error })
  }
}