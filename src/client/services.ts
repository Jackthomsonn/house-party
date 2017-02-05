import * as $ from 'jquery'
import * as Promise from 'promise'
import Settings from './settings'

export default class Services {

  public static getSongs(alternativeUrl?: any) {
    return new Promise<Array<Interfaces.ISong>>((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: alternativeUrl ? alternativeUrl : '/api/music',
      }).done((results: Array<Interfaces.ISong>) => {
        resolve(results)
      }).fail((error) => {
        reject('Error getting data from server')
      })
    })
  }

  public static requestSong(requestedSong: Interfaces.ISongLink) {
    Settings.socket.emit('songChanged', true)
    return new Promise((resolve: any, reject) => {
      this.equalityCheck(requestedSong) ? reject('Song is already in queue') :
        resolve(this.createRequest(requestedSong))
    })
  }

  public static removeSong(songToRemove: String) {
    return new Promise((resolve: any, reject) => {
      $.ajax({
        method: 'DELETE',
        url: '/api/music/requests/' + songToRemove
      }).done(() => {
        resolve()
      }).fail((error) => {
        reject('There was an error when trying to delete this song')
      })
    })
  }

  private static equalityCheck(requestedSong: Interfaces.ISongLink) {
    let exists = false
    $.ajax({
      async: false,
      method: 'GET',
      url: '/api/music/requests'
    }).done((responses: Array<Interfaces.ISong>) => {
      responses.map((response: Interfaces.ISongLink) => {
        if (requestedSong.link === response.link) {
          exists = true
        }
      })
    })
    return exists
  }

  private static createRequest(requestedSong: Interfaces.ISongLink) {
    $.ajax({
      async: false,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        artist: requestedSong.artist,
        image: requestedSong.image,
        link: requestedSong.link,
        songName: requestedSong.songName,
      }),
      dataType: 'json',
      method: 'POST',
      url: '/api/music/requests',
    }).done(() => {
      Settings.socket.emit('songRequested', {
        artist: requestedSong.artist,
        image: requestedSong.image,
        songName: requestedSong.songName
      })
    }).fail((error) => {
      return error
    })
  }
}