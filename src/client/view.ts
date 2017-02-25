import * as $ from 'jquery'
import { Notification } from './notification'
import { Services } from './services'

export class View {
  public body: any
  public codeButton: any
  public code: any
  public currentlyPlaying: any
  public notification: Notification
  public header: any
  public loading: any
  public outerBody: any
  public parent: any
  public songRequestHeader: any
  public songRequestList: any
  public clearSearchButton: any
  public onlineCount: any
  public splash: any
  public splashHeader: any
  public splashInner: any
  public splashInput: any
  public splashButton: any
  public revealContainer: any
  public reveal: any
  public revealPartyId: any
  public closeList: any
  public clearSearchField: any
  public createParty: any
  public copyCode: any
  public joinParty: any
  public partyId: any
  public partyName: any
  public search: any
  public startParty: any
  public userName: any
  public viewList: any

  constructor() {
    this.body = $('body')
    this.codeButton = $('.copy-code')
    this.code = $('.code')
    this.currentlyPlaying = $('.currently-playing')
    this.notification = new Notification()
    this.header = $('header > div h2')
    this.loading = $('.loading-container')
    this.outerBody = $('.outer, header, .sub-header')
    this.parent = $('.outer')
    this.songRequestHeader = $('.song-queue_header')
    this.songRequestList = $('.song-queue_list')
    this.clearSearchButton = $('.close')
    this.onlineCount = $('.online-count')
    this.splash = $('.splash')
    this.splashHeader = $('.splash .splash_header')
    this.splashInner = $('.splash .splash_inner')
    this.splashInput = $('.splash .splash_inner input')
    this.splashButton = $('.splash .splash_inner button')
    this.revealContainer = $('.splash').find('.reveal, .reveal_inner')
    this.reveal = $('.splash .reveal .reveal_inner > h2, p')
    this.revealPartyId = $('.splash .reveal h3')
    this.closeList = document.querySelector('.close-list')
    this.clearSearchField = document.querySelector('.close')
    this.copyCode = document.querySelector('.copy-code')
    this.createParty = document.querySelector('.create-party')
    this.joinParty = document.querySelector('.join-party')
    this.partyId = document.querySelector('.party-id')
    this.partyName = document.querySelector('.party-name')
    this.search = document.querySelector('.search')
    this.startParty = document.querySelector('.start-party')
    this.userName = document.querySelector('.user-name')
    this.viewList = document.querySelector('.view-list')
  }

  public makeList(songs: Array<Interfaces.ISongLink>, isFilter?: Boolean) {
    this.parent.find('.card').remove()
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
        Services.requestSong(songs[index])
          .then(() => {
            return
          }).catch((error) => {
            this.notification.show(error, true)
          })
      })
    })
  }

  public updateHeader(partyName: String) {
    this.header.html(`${partyName}`)
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
    this.parent.find('.card').remove()
    songs.map((song: Interfaces.ISong, index) => {
      if (song.shortName === Services.partyId) {
        this.parent.append(`<div class="card">
          <img src="${song.image}"></img>
          <div class="info">
            <p>${song.artist}</p>
            <p>${song.songName}</p>
          </div>
        </div>`)
      }
    })
  }

  public updateSongQueue(song: Interfaces.ISong) {
    this.parent.append(`<div class="card">
        <img src="${song.image}"></img>
        <div class="info">
          <p>${song.artist}</p>
          <p>${song.songName}</p>
        </div>
      </div>`)
  }

  public removeSongFromQueue() {
    this.parent.find('.card').first().remove()
  }

  public setCurrentSong(songs: Array<Interfaces.ISong>) {
    if (songs.length === 0) {
      this.currentlyPlaying.html('There are no songs in the queue yet')
    }
    this.currentlyPlaying.html(`Currently playing: ${songs[0].artist} - ${songs[0].songName}`)
  }

  public clearSearch(value: Boolean) {
    value ? this.clearSearchButton.css('visibility', 'visible') : this.clearSearchButton.css('visibility', 'hidden')
  }

  public closeSplash() {
    this.outerBody.hide()
    this.splashInput.addClass('slide-left')
    this.splashButton.addClass('slide-right')
    this.splashHeader.addClass('slide-up')
    setTimeout(() => {
      this.splash.hide()
      this.outerBody.fadeIn(700)
    }, 700)
  }

  public showCreatedParty(createdParty: Interfaces.IHouseParty) {
    this.splashInput.addClass('slide-left')
    this.splashButton.addClass('slide-right')
    setTimeout(() => {
      this.revealContainer.attr('style', 'display: flex')
      this.splashInner.remove()
      this.revealPartyId.html(`${createdParty.shortName}`)
      this.revealPartyId.addClass('show')
      this.reveal.addClass('show')
    }, 700)
  }

  public showLoader() {
    this.loading.show()
  }

  public hideLoader() {
    this.loading.hide()
  }

  public updateCount(online: Number) {
    this.onlineCount.html(`Clients connected: ${online}`)
  }
}