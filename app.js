const express = require('express')

const app = express()

// Listen on port 3000
const server = app.listen(3333)

// socket.io instantiation
const io = require('socket.io')(server)

const game = {
  players: [],
  queue: [],
  maxPlayers: 5
}

const connections = []

const removeFromList = (list, item) => {
  const i = list.findIndex(x => x === item)
  if (i > 0) {
    list.splice(i, 1)
  }
}

const listenNumbers = socket => {
  console.log('Listening guess for', socket.username)
  socket.on('send_number', ({ number }) => {
    console.log(socket.username, number)
  })
}

// listen on every connection
io.on('connection', socket => {
  const d = new Date()
  socket.username = `User_${d.getSeconds()}_${d.getMilliseconds()}`
  connections.push(socket)
  socket.emit('you', socket.username)
  if (game.players.length < game.maxPlayers) {
    game.players.push(socket.username)
    listenNumbers(socket)
  } else {
    game.queue.push(socket.username)
  }
  io.sockets.emit('game_update', JSON.stringify(game))
  socket.on('disconnect', () => {
    const userIsPlaying = game.players.find(x => x === socket.username)
    if (userIsPlaying) {
      const i = game.players.findIndex(x => x === socket.username)
      game.players.splice(i, 1)
      // take the first in queue for playing
      const firstInQueue = game.queue[0]
      game.players.push(firstInQueue)
      game.queue.splice(0, 1)
      const conn = connections.find(x => x.username === firstInQueue)
      listenNumbers(conn)
    } else {
      const i = game.queue.findIndex(x => x === socket.username)
      game.queue.splice(i, 1)
      removeFromList(game.queue, socket.username)
      removeFromList(connections, socket)
    }
    io.sockets.emit('game_update', JSON.stringify(game))
  })
})
