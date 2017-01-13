import $ from 'jquery';
import Settings from './settings'

export default class Services {

  public static getSongs(alternativeUrl?: any) {
    return new Promise( (resolve, reject) => {
      $.ajax({
        url: alternativeUrl ? alternativeUrl : '/api/music',
        method: 'GET'
      }).done( (results) => {
        resolve(results)
      }).fail( (error) => {
        reject('Error getting data from server')
      })
    })
  }

  public static equalityCheck(requestedSong: any) {
    let exists = false
    $.ajax({
      url: '/api/music/requests',
      method: 'GET',
      async: false,
    }).done( (responses) => {
      responses.map( (response: any) => {
        requestedSong.link === response.link ? true : false
      })
    })
    return exists
  }

  public static createRequest(requestedSong: any) {
    $.ajax({
      url: '/api/music/requests',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: false,
      data: JSON.stringify({
        image: requestedSong.image,
        songName: requestedSong.songName,
        artist: requestedSong.artist,
        link: requestedSong.link
      })
    }).done( (response) => {
      Settings.socket.emit('songRequested', {
        image: requestedSong.image,
        artist: requestedSong.artist,
        songName: requestedSong.songName
      })
    }).fail( (error) => {
      return error
    })
  }

  public static requestSong(requestedSong: any) {
    return new Promise( (resolve: any, reject: any) => {
      this.equalityCheck(requestedSong) ? reject('Song is already in queue') : resolve(this.createRequest(requestedSong))
    })
  }

  public static removeSong(songToRemove: any) {
    return new Promise( (resolve, reject) => {
      $.ajax({
        url: '/api/music/requests/' + songToRemove,
        method: 'DELETE'
      }).done( (response) => {
        resolve()
      }).fail( (error) => {
        reject('There was an error when trying to delete this song')
      })
    })
  }
}