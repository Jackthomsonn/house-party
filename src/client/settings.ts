import io from 'socket.io-client'

export default class Settings {
  public static socket: any

  public static init() {
    this.socket = io.connect('http://192.168.0.11:3000');
  }

  public static isPlayer() {
    return document.querySelector('audio')
  }
}