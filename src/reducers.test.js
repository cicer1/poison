import { addPlayer, removePlayer } from './actions'
import game, { initialState } from './reducers'

describe('reducers', () => {
  it('should return the default state', () => {
    expect(game()).toEqual(initialState)
  })
  describe('addPlayer', () => {
    let stateStep1
    it('should add the first player to players list', () => {
      stateStep1 = game(initialState, addPlayer('foo'))
      expect(stateStep1.players.length).toEqual(1)
      expect(stateStep1.players).toEqual(['foo'])
    })

    it('should add the second player to players list too', () => {
      const stateStep2 = game(stateStep1, addPlayer('bar'))
      expect(stateStep2.players.length).toEqual(2)
      expect(stateStep2.players).toEqual(['foo', 'bar'])
    })

    it('should add the players to players list until maxPlayers', () => {
      const step10 = addTenPlayers()
      const ten = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      expect(step10.players.length).toEqual(10)
      expect(step10.players).toEqual(ten)
      const step11 = game(step10, addPlayer('11'))
      expect(step11.players.length).toEqual(10)
    })

    it('after maxPlayers adds to queue', () => {
      const step10 = addTenPlayers()
      expect(step10.queue.length).toEqual(0)
      const step11 = game(step10, addPlayer('11'))
      expect(step11.queue.length).toEqual(1)
      const step21 = addTenPlayers(step11)
      expect(step21.queue.length).toEqual(11)
    })
  })
})

const addTenPlayers = (start = initialState) => {
  const step1 = game(start, addPlayer('1'))
  const step2 = game(step1, addPlayer('2'))
  const step3 = game(step2, addPlayer('3'))
  const step4 = game(step3, addPlayer('4'))
  const step5 = game(step4, addPlayer('5'))
  const step6 = game(step5, addPlayer('6'))
  const step7 = game(step6, addPlayer('7'))
  const step8 = game(step7, addPlayer('8'))
  const step9 = game(step8, addPlayer('9'))
  const step10 = game(step9, addPlayer('10'))
  return step10
}
