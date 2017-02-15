import Service from './services'

export default class Notification {
  private notification: any

  constructor() {
    this.notification = document.querySelector('.notification')
  }

  public show = (data: any, isCustom?: Boolean) => {
    this.notification.style.transform = 'translateY(0)'
    isCustom ? this.notification.innerHTML = data :
      this.notification.innerHTML = `${data.username} just requested ${data.artist} - ${data.songName}`
    setTimeout(this.hide, 3000)
  }

  public hide = () => {
    this.notification.style.transform = 'translateY(5em)'
  }
}