import * as $ from 'jquery';
import Settings from './settings'
import * as Promise from 'promise'

export default class Services {

  public static getSongs(alternativeUrl?: any) {
    return new Promise<Array<Interfaces.ISong>>( (resolve, reject) => {
      $.ajax({
        url: alternativeUrl ? alternativeUrl : '/api/music',
        method: 'GET'
      }).done( (results: Array<Interfaces.ISong>) => {
        resolve(results)
      }).fail( (error) => {
        reject('Error getting data from server')
      })
    })
  }

  public static requestSong(requestedSong: Interfaces.ISongLink) {
    return new Promise( (resolve: any, reject) => {
      this.equalityCheck(requestedSong) ? reject('Song is already in queue') :
      resolve(this.createRequest(requestedSong))
    })
  }

  public static removeSong(songToRemove: String) {
    return new Promise( (resolve: any, reject) => {
      $.ajax({
        url: '/api/music/requests/' + songToRemove,
        method: 'DELETE'
      }).done( () => {
        resolve()
      }).fail( (error) => {
        reject('There was an error when trying to delete this song')
      })
    })
  }

  private static equalityCheck(requestedSong: Interfaces.ISongLink) {
    let exists = false
    $.ajax({
      url: '/api/music/requests',
      method: 'GET',
      async: false,
    }).done( (responses: Array<Interfaces.ISong>) => {
      responses.map( (response: Interfaces.ISongLink) => {
        if(requestedSong.link === response.link) {
          exists = true
        }
      })
    })
    return exists
  }

  private static createRequest(requestedSong: Interfaces.ISongLink) {
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
    }).done( () => {
      Settings.socket.emit('songRequested', {
        image: requestedSong.image,
        artist: requestedSong.artist,
        songName: requestedSong.songName
      })
    }).fail( (error) => {
      return error
    })
  }
}