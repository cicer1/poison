// action types
export const ADD_PLAYER = 'ADD_PLAYER'
export const REMOVE_PLAYER = 'REMOVE_PLAYER'

// action creators
export const addPlayer = player => ({
  type: ADD_PLAYER,
  payload: player
})

export const removePlayer = player => ({
  type: REMOVE_PLAYER,
  payload: player
})
