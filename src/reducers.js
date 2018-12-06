import { ADD_PLAYER, REMOVE_PLAYER } from './actions'
export default game

export const initialState = {
  maxPlayers: 10,
  players: [],
  queue: []
}

function game (state = initialState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case ADD_PLAYER:
      return addPlayer(state, payload)
    case REMOVE_PLAYER:
      return removePlayer(state, payload)
    default:
      return state
  }
}

function addPlayer (state, player) {
  return state.players.length < 10
    ? { ...state, players: state.players.slice().concat(player) }
    : { ...state, queue: state.queue.slice().concat(player) }
}

function removePlayer (state, player) {
  const playerIsInPlayers = state.players.find(x => x === player)
  const playerIsInQueue = state.queue.find(x => x === player)
  if (playerIsInPlayers) {
    const index = state.players.findIndex(x => x === player)
    const newPlayers = state.players.slice()
    newPlayers.splice(index, 1)
    return { ...state, players: newPlayers }
  } else if (playerIsInQueue) {
    const index = state.queue.findIndex(x => x === player)
    const newQueue = state.queue.slice()
    newQueue.splice(index, 1)
    return { ...state, queue: newQueue }
  }
  return { ...state }
}
