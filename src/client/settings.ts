import * as io from 'socket.io-client'

export default class Settings {
  public static socket: any

  public static init() {
    this.socket = io.connect('https://house-party.herokuapp.com/')
  }

  public static isPlayer() {
    return document.querySelector('audio')
  }
}