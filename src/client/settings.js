import io from 'socket.io-client'

export default class Settings {
  static init() {
    this.socket = io.connect('http://192.168.0.11:3000');
  }

  static isPlayer() {
    return document.querySelector('audio')
  }
}