import * as $ from 'jquery'
import * as Promise from 'promise'
import * as shortId from 'shortid'
import Settings from './settings'

export default class Services {
  public static partyId: String
  public static username: String

  public static getSongs(alternativeUrl?: any) {
    alternativeUrl = alternativeUrl
    return new Promise<Array<Interfaces.ISong>>((resolve, reject) => {
      if (!this.partyId) {
        reject('It looks like no party has been selected')
        return
      }
      const partySongs: Array<Interfaces.ISong> = []
      $.ajax({
        method: 'GET',
        url: alternativeUrl ? alternativeUrl : '/api/music',
      }).done((results: Array<Interfaces.ISong>) => {
        if (alternativeUrl === '/api/music/requests') {
          if (results.length === 0) {
            resolve([])
            return
          }
          results.map((song) => {
            if (song.shortName === Services.partyId) {
              partySongs.push(song)
              resolve(partySongs)
            }
          })
        } else {
          resolve(results)
        }
      }).fail((error) => {
        reject('Whoops! It looks like house party is having some technical difficulties. Please try again later')
      })
    })
  }

  public static getPartyName(partyId: String) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: '/api/house-parties'
      }).done((parties) => {
        parties.map((party: Interfaces.IHouseParty) => {
          if (party.shortName === partyId) {
            resolve(party.name)
          }
        })
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
    return new Promise((resolve, reject) => {
      if (!houseParty.name) {
        reject('Please provide a name for your house party')
        return
      }
      $.ajax({
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
          name: houseParty.name,
          shortName: shortId.generate()
        }),
        dataType: 'json',
        method: 'POST',
        url: '/api/house-parties',
      }).done((party) => {
        resolve(party)
      }).fail((error) => {
        reject(`Whoops! It looks like house party is having some technical difficulties. Please try again later`)
      })
    })
  }

  public static partyExists(callback: Function) {
    $.ajax({
      method: 'GET',
      url: '/api/house-parties'
    }).done((parties) => {
      const exists = parties.some((party: Interfaces.IHouseParty) => party.shortName === this.partyId)
      exists ? callback(true) : callback(false)
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
        if (response.shortName === this.partyId) {
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
        shortName: this.partyId,
        songName: requestedSong.songName,
        username: this.username
      }),
      dataType: 'json',
      method: 'POST',
      url: '/api/music/requests',
    }).done(() => {
      Settings.socket.emit('songRequested', {
        artist: requestedSong.artist,
        image: requestedSong.image,
        shortName: this.partyId,
        songName: requestedSong.songName,
        username: this.username ? this.username : 'Someone'
      })
    }).fail((error) => {
      return error
    })
  }
}