const express = require('express')
const LinkedList = require('circular-list')

const app = express()

// Listen on port 3000
const server = app.listen(3333)

// socket.io instantiation
const io = require('socket.io')(server)

const game = {
  players: [],
  queue: [],
  maxPlayers: 5,
  list: null
}

const connections = []

const removeFromList = (list, item) => {
  const i = list.findIndex(x => x === item)
  if (i > 0) {
    list.splice(i, 1)
  }
}

const publishGame = () => {
  let activePlayer = null

  if (game.list) {
    game.list.each(p => {
      console.log(p)
      if (p.active) {
        activePlayer = p.player
      }
    })
  }
  activePlayer && console.log('activePlayer:', activePlayer)

  io.sockets.emit(
    'game_update',
    JSON.stringify({
      players: game.players,
      queue: game.queue,
      maxPlayers: game.maxPlayers,
      activePlayer
    })
  )
}

const listenNumbers = socket => {
  socket.on('send_number', ({ number }) => {
    console.log('NUMBER: ', number)

    const node = new LinkedList.Node({
      player: game.list.first.data.player,
      active: false
    })
    game.list.remove(game.list.first)
    game.list.append(node)
    game.list.first.data.active = true
    publishGame()
  })
}

const startGame = () => {
  console.log('start')
  game.list = new LinkedList()
  game.players.forEach(player =>
    game.list.append(new LinkedList.Node({ player, active: false }))
  )
  game.list.first.data.active = true
  publishGame()
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
    if (game.players.length === game.maxPlayers) {
      startGame()
    }
  } else {
    game.queue.push(socket.username)
  }
  publishGame()

  socket.on('disconnect', () => {
    const userIsPlaying = game.players.find(x => x === socket.username)
    if (userIsPlaying) {
      const i = game.players.findIndex(x => x === socket.username)
      game.players.splice(i, 1)
      // take the first in queue for playing
      const firstInQueue = game.queue[0]
      if (firstInQueue) {
        game.players.push(firstInQueue)
        game.queue.splice(0, 1)
        const conn = connections.find(x => x.username === firstInQueue)
        listenNumbers(conn)
      }
    } else {
      const i = game.queue.findIndex(x => x === socket.username)
      game.queue.splice(i, 1)
      removeFromList(game.queue, socket.username)
      removeFromList(connections, socket)
    }
    publishGame()
  })
})
