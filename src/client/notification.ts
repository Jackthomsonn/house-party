export class Notification {
  private hideTimeout: any
  private notification: any
  private showTimeout: any

  constructor() {
    this.hideTimeout
    this.notification = document.querySelector('.notification')
    this.showTimeout
  }

  public show = (data: any, isCustom?: Boolean, autoHide: Boolean = true) => {
    this.hide()
    clearTimeout(this.hideTimeout)
    clearTimeout(this.showTimeout)
    this.showTimeout = setTimeout(() => {
      this.notification.style.transform = 'translateY(0)'
      isCustom ? this.notification.innerHTML = data :
        this.notification.innerHTML = `${data.username} just requested ${data.artist} - ${data.songName}`
      autoHide ? this.hideTimeout = setTimeout(this.hide, 3000) : undefined
    }, 400)
  }

  public hide = () => {
    this.notification.style.transform = 'translateY(5em)'
  }
}