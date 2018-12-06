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
  return { ...state }
}
