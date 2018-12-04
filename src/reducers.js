import { ADD_PLAYER, REMOVE_PLAYER, START_ROUND } from './actions'
import AVATARS from './avarars'
export default game

const firstAvailableSlot = () => AVATARS.find(x => x.available)

function Player (id) {
  this.totalLife = 5
  return {
    id,
    active: false,
    alive: true,
    remaining: this.totalLife
  }
}

export const initialState = {
  players: [],
  queue: [],
  maxPlayers: AVATARS.length,
  round: {
    ongoing: false,
    guess: null
  }
}

function expenses (state = initialState, action = {}) {
  switch (action.type) {
    case ADD_PLAYER:
      return {
        ...state
      }
    case REMOVE_PLAYER:
      return {
        ...state
      }
    case START_ROUND:
      return {
        ...state,
        round: { ...state.round, ongoing: true, guess: 5 }
      }
    default:
      return state
  }
}
