import * as Promise from 'promise'
import * as io from 'socket.io-client'
import { Services } from './services'

export class Settings {
  public static socket: any

  public static init() {
    return new Promise((resolve, reject) => {
      Services.getSocketUri((uri: string) => {
        resolve(this.socket = io.connect(uri, {
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        }))
      })
    })
  }

  public static isPlayer() {
    return document.querySelector('audio')
  }
}