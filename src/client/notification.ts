import Service from './services'

export default class Notification {
  private notification: any
  private hideTimeout: any
  private showTimeout: any

  constructor() {
    this.notification = document.querySelector('.notification')
    this.hideTimeout
    this.showTimeout
  }

  public show = (data: any, isCustom?: Boolean) => {
    this.hide()
    clearTimeout(this.hideTimeout)
    clearTimeout(this.showTimeout)
    this.showTimeout = setTimeout(() => {
      this.notification.style.transform = 'translateY(0)'
      isCustom ? this.notification.innerHTML = data :
        this.notification.innerHTML = `${data.username} just requested ${data.artist} - ${data.songName}`
      this.hideTimeout = setTimeout(this.hide, 3000)
    }, 400)
  }

  public hide = () => {
    this.notification.style.transform = 'translateY(5em)'
  }
}