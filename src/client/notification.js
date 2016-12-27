export default class Notification {
  static show(data, isError) {
    this.notification = document.querySelector('.notification')
    this.notification.style.transform = 'translateY(0)'
    isError ? this.notification.innerHTML = data : this.notification.innerHTML = `Someone just requested ${data.artist} - ${data.songName}`
    setTimeout(this.hide, 3000)
  }

  static hide() {
    this.notification = document.querySelector('.notification')
    this.notification.style.transform = 'translateY(100vh)'
  }
}