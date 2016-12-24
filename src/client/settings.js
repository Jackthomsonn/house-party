import io from 'socket.io-client'

export default class Settings {
  static init() {
    this.socket = io.connect('http://localhost:3000');
  }
}