const express = require('express')
const app = express()

// Listen on port 3000
server = app.listen(3333)

// socket.io instantiation
const io = require('socket.io')(server)
const AVATARS = [
  { name: 'Roberto Baggio', available: true },
  { name: 'Batistuta', available: true },
  { name: 'Crespo', available: true },
  { name: 'Balbo', available: true },
  { name: 'Vieri', available: true },
  { name: 'Del Piero', available: true },
  { name: 'Totti', available: true },
  { name: 'Boban', available: true },
  { name: 'Salas', available: true },
  { name: 'Hubner', available: true }
]
const game = {
  players: [],
  activePlayers: [],
  queue: [],
  maxPlayers: AVATARS.length,
  ongoingRound: false
}
let currentRound = null

function Round () {
  return {
    guess: 5
  }
}

const firstAvailableSlot = () => AVATARS.find(x => x.available)

// const getRandomPair = () => ({ a: Math.random(), b: Math.random() })

const listenNumbers = socket => {
  console.log('Listening guess')
  if (currentRound) {
    socket.on('send_number', ({ number }) => {
      console.log(currentRound.guess, number)
    })
  }
}

const startNewRound = () => {
  game.ongoingRound = true
  currentRound = new Round()
  game.activePlayers = game.players.slice()
  io.sockets.emit('game_update', JSON.stringify(game))
  console.log('Starting new round')
}

// listen on every connection
io.on('connection', socket => {
  slotAvailable = firstAvailableSlot()
  if (slotAvailable) {
    slotAvailable.available = false
    socket.username = slotAvailable.name
    game.players.push(socket.username)
  } else {
    socket.username = `anonymous${game.queue.length + 1}`
    game.queue.push(socket.username)
  }
  socket.emit('you', socket.username)
  io.sockets.emit('game_update', JSON.stringify(game))

  listenNumbers(socket)
  if (game.players.length > 1 && !game.ongoingRound) {
    startNewRound()
  }

  socket.on('disconnect', function () {
    console.log('disconnect', socket.username)

    userIsPlaying = game.players.find(x => x === socket.username)

    if (userIsPlaying) {
      AVATARS.find(x => x.name === socket.username).available = true
      const i = game.players.findIndex(x => x === socket.username)
      game.players.splice(i, 1)
    } else {
      const i = game.queue.findIndex(x => x === socket.username)
      game.queue.splice(i, 1)
    }
    io.sockets.emit('game_update', JSON.stringify(game))
  })
  // //default username
  // socket.username = "Anonymous"

  //   //listen on change_username
  //   socket.on('change_username', (data) => {
  //       socket.username = data.username
  //   })

  //   //listen on new_message
  //   socket.on('new_message', (data) => {
  //       //broadcast the new message
  //       io.sockets.emit('new_message', {message : data.message, username : socket.username});
  //   })

  //   //listen on typing
  //   socket.on('typing', (data) => {
  //   	io.sockets.emit('typing', {username : socket.username})
  //   })
})
