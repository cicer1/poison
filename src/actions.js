// action types
export const ADD_PLAYER = 'ADD_PLAYER'
export const REMOVE_PLAYER = 'REMOVE_PLAYER'
export const START_ROUND = 'START_ROUND'

// action creators
export const addPlayer = player => ({
  type: ADD_PLAYER,
  player
})

export const removePlayer = player => ({
  type: REMOVE_PLAYER,
  player
})

export const startRound = () => ({
  type: START_ROUND
})
