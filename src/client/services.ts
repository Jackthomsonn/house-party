import * as $ from 'jquery'
import * as Promise from 'promise'
import * as shortId from 'shortid'
import Settings from './settings'

export default class Services {
  public static partyId: String

  public static getSongs(alternativeUrl?: any) {
    alternativeUrl = alternativeUrl
    if (!this.partyId) {
      return
    }
    return new Promise<Array<Interfaces.ISong>>((resolve, reject) => {
      const partySongs: any = []
      $.ajax({
        method: 'GET',
        url: alternativeUrl ? alternativeUrl : '/api/music',
      }).done((results: Array<Interfaces.ISong>) => {
        if (alternativeUrl === '/api/music/requests') {
          results.map((song) => {
            if (song.partyId === Services.partyId) {
              partySongs.push(song)
              resolve(partySongs)
            }
          })
        } else {
          resolve(results)
        }
      }).fail((error) => {
        reject('Error getting data from server')
      })
    })
  }

  public static requestSong(requestedSong: Interfaces.ISongLink) {
    Settings.socket.emit('songChanged', {
      changed: true,
      partyId: this.partyId
    })
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

  public static createParty(houseParty: Interfaces.IHouseParty) {
    if (!houseParty.name) {
      return
    }
    return new Promise((resolve, reject) => {
      $.ajax({
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
          name: houseParty.name,
          shortName: shortId.generate()
        }),
        dataType: 'json',
        method: 'POST',
        url: '/api/house-parties',
      }).done(() => {
        resolve('Party Created')
      }).fail((error) => {
        reject(error)
      })
    })
  }

  public static partyExists(exists: Function) {
    $.ajax({
      method: 'GET',
      url: '/api/house-parties'
    }).done((parties) => {
      parties.map((party: any) => {
        if (party._id === this.partyId) {
          exists(true)
        } else {
          exists(false)
        }
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
        if (response.partyId === this.partyId) {
          if (requestedSong.link === response.link) {
            exists = true
          }
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
        partyId: this.partyId,
        songName: requestedSong.songName
      }),
      dataType: 'json',
      method: 'POST',
      url: '/api/music/requests',
    }).done(() => {
      Settings.socket.emit('songRequested', {
        artist: requestedSong.artist,
        image: requestedSong.image,
        partyId: this.partyId,
        songName: requestedSong.songName
      })
    }).fail((error) => {
      return error
    })
  }
}