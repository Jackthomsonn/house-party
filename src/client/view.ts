import * as $ from 'jquery'
import Notification from './notification'
import Service from './services'

export default class View {
  private body: any
  private currentlyPlaying: any
  private notification: Notification
  private parent: any
  private songRequestHeader: any
  private songRequestList: any
  private clearSearchButton: any

  constructor() {
    this.body = $('body')
    this.currentlyPlaying = $('.currently-playing')
    this.notification = new Notification()
    this.parent = $('.outer')
    this.songRequestHeader = $('.song-queue_header')
    this.songRequestList = $('.song-queue_list')
    this.clearSearchButton = $('.close')
  }

  public makeList(songs: Array<Interfaces.ISongLink>, isFilter?: Boolean) {
    if (isFilter) {
      this.parent.find('.card').remove()
    }
    songs.map((song: Interfaces.ISong, index: any) => {
      this.parent.append(`<div class="card">
        <img src="${song.image}"></img>
        <div class="info">
          <p>${song.songName}</p>
          <p>${song.artist}</p>
        </div>
        <div class="actions">
          <button class="list">Request</button>
        </div>
      </div>`)

      const buttons: any = document.querySelectorAll('button.list')
      buttons[index].addEventListener('click', () => {
        Service.requestSong(songs[index])
          .then(() => {
            return
          }).catch((error) => {
            this.notification.show(error, true)
          })
      })
    })
  }

  public showSongRequestList(songs: Array<Interfaces.ISongLink>) {
    songs.map((song) => {
      this.songRequestList.append(`<div class='card'>
        <img src='${song.image}'></img>
        <div class='info'>
          <p>${song.artist}</p>
          <p>${song.songName}</p>
        </div>
      </div>`)
    })
    this.songRequestList.attr('style', 'visibility: visible')
    this.songRequestHeader.attr('style', 'visibility: visible')
  }

  public closeSongRequestList() {
    this.songRequestList.attr('style', 'visibility: hidden')
    this.songRequestHeader.attr('style', 'visibility: hidden')
    this.songRequestList.find('.card').remove()
  }

  public songQueue(songs: Array<Interfaces.ISong>) {
    songs.map((song: Interfaces.ISong, index) => {
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
    )
  }

  public removeSongFromQueue() {
    this.parent.find('.card').first().remove()
  }

  public setCurrentSong(songs: Array<Interfaces.ISong>) {
    if (songs.length === 0) {
      this.currentlyPlaying.html('There are no songs in the queue yet');
    }
    this.currentlyPlaying.html(`Currently playing: ${songs[0].artist} - ${songs[0].songName}`)
  }

  public clearSearch(value: Boolean) {
    value ? this.clearSearchButton.css('visibility', 'visible') : this.clearSearchButton.css('visibility', 'hidden')
  }
}