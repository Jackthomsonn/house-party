export default class Notification {
  private notification: any

  constructor() {
    this.notification = document.querySelector('.notification')
  }

  public show = (data: Interfaces.INotification, isError?: Boolean) => {
    this.notification.style.transform = 'translateY(0)'
    isError ? this.notification.innerHTML = data :
      this.notification.innerHTML = `${data.username} just requested ${data.artist} - ${data.songName}`
    setTimeout(this.hide, 3000)
  }

  public hide = () => {
    console.log('Hide')
    this.notification.style.transform = 'translateY(100vh)'
  }
}