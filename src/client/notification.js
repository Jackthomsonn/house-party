export default class Notification {
  static show(data) {
    this.notification = document.querySelector('.notification')
    this.notification.style.transform = 'translateY(0)'
    this.notification.innerHTML = `Someone just requested ${data.artist} - ${data.songName}`
    setTimeout( () => {
      this.hide()
    }, 3000)
  }
  static hide() {
    this.notification = document.querySelector('.notification')
    this.notification.style.transform = 'translateY(5em)'
  }
}