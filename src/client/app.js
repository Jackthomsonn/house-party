import Service from './services'
import View from './view'
import Settings from './settings'
import Notification from './notification'
import $ from 'jquery';

export default class App {
  constructor() {
    Settings.init()

    Service.getSongs('/api/music', 'GET').then( (songs) => {
      View.makeList(songs)
    })

    Settings.socket.on('songRequested', (data) => {
      Notification.show(data)
    })
  }
}

new App()