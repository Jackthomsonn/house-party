import $ from 'jquery';

export default class Services {
  static getSongs() {
    return new Promise( (resolve, reject) => {
      $.ajax({
        url: '/api/music',
        method: 'GET'
      }).done( (results) => {
        resolve(results)
      }).fail( (error) => {
        reject('Error getting data from server')
      })
    })
  }

  static equalityCheck(requestedSong) {
    let exists = false
    $.ajax({
      url: '/api/music/requests',
      method: 'GET',
      async: false,
    }).done( (responses) => {
      responses.map( (response) => {
        if(requestedSong._id === response._id) {
          exists = true
        }
      })
    })
    return exists
  }

  static createRequest(requestedSong) {
    $.ajax({
      url: '/api/music/requests',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({
        _id: requestedSong._id,
        songName: requestedSong.songName,
        artist: requestedSong.artist,
        link: requestedSong.link
      })
    })
  }

  static requestSong(requestedSong) {
    return new Promise( (resolve, reject) => {
      this.equalityCheck(requestedSong) ? reject('Already in queue') : this.createRequest(requestedSong) && resolve()
    })
  }
}