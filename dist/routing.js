function routing() { }

routing.prototype.route = function (app) {
  app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/views/index.html')
  })

  app.get('/player', (req, res) => {
    res.status(200).sendFile(__dirname + '/views/player/index.html')
  })

  app.get('/create', (req, res) => {
    res.status(200).sendFile(__dirname + '/views/create/index.html')
  })
}

module.exports = new routing()