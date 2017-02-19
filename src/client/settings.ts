import * as Promise from 'promise'
import * as io from 'socket.io-client'
import Services from './services'

export default class Settings {
  public static socket: any

  public static init() {
    return new Promise( (resolve, reject) => {
      Services.getSocketUri( (uri: String) => (resolve(this.socket = io.connect(uri))))
    })
  }

  public static isPlayer() {
    return document.querySelector('audio')
  }
}