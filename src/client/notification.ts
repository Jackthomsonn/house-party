export default class Notification {
  public static notification: any

  public static show(data: Interfaces.INotification, isError?: Boolean) {
    this.notification.style.transform = 'translateY(0)'
    isError ? this.notification.innerHTML = data :
    this.notification.innerHTML = `Someone just requested ${data.artist} - ${data.songName}`
    setTimeout(this.hide, 3000)
  }

  public static hide() {
    this.notification.style.transform = 'translateY(100vh)'
  }
}