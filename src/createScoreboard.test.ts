import { createScoreboard, formatMsgs, sortStr } from './createScoreboard';

describe('formatMsgs', () => {
  test('formatMsgs', () => {
    const normalInput = `
      Allegoric Alaskans;Blithering Badgers;win
      Devastating Donkeys;Courageous Californians;draw
      Devastating Donkeys;Allegoric Alaskans;win
      Courageous Californians;Blithering Badgers;loss
      Blithering Badgers;Devastating Donkeys;loss
      Allegoric Alaskans; Courageous Californians;win
    `
    const result = formatMsgs(normalInput)
    expect(result).toHaveLength(6)
    expect(result[0][0]).toBe('Allegoric Alaskans')
    expect(result[1][0]).toBe('Devastating Donkeys')
  })
  test('formatMsgs with invalid input', () => {
    const normalInput = `
      Allegoric Alaskans;Blithering Badgers;wissn
      Devastating Donkeys;Courageous Californians;draw
      Devastating Donkeys;Allegoric Alaskans;win
      Courageous Californians;Blithering Badgers;loss
      Blithering Badgers;Devastating Donkeys;loss
      Allegoric Alaskans; Courageous Californians;win
    `
    const result = formatMsgs(normalInput)
    expect(result).toHaveLength(5)
  })
})

describe('createScoreboard', () => {
  test('record', () => {
    const board = createScoreboard()
    const normalInput = `
      Allegoric Alaskans;Blithering Badgers;win
      Devastating Donkeys;Courageous Californians;draw
      Devastating Donkeys;Allegoric Alaskans;win
      Courageous Californians;Blithering Badgers;loss
      Blithering Badgers;Devastating Donkeys;loss
      Allegoric Alaskans; Courageous Californians;win
    `
    board.record(normalInput)
    const result = board.output()
    expect(result['Courageous Californians'].L).toBe(2)
  })

  test('sort str', () => {
    expect(sortStr('aaa', 'abb')).toBe(-1)
    expect(sortStr('aba', 'abb')).toBe(-1)
    expect(sortStr('abaaa', 'abb')).toBe(-1)
    expect(sortStr('abb', 'abb')).toBe(0)
    expect(sortStr('abb', 'aba')).toBe(1)
  })

  test('sort record by points', () => {
    const board = createScoreboard()
    const result = board.sortRecords({
      aaa: {
        MP: 3,
        W: 2,
        D: 1,
        L: 1,
      },
      abb: {
        MP: 3,
        W: 4,
        D: 1,
        L: 1,
      },
      aba: {
        MP: 3,
        W: 1,
        D: 1,
        L: 1,
      },
    })
    expect(result[0].Name).toBe('abb')
    expect(result[2].Name).toBe('aba')
  })

  test('sort record by team name', () => {
    const board = createScoreboard()
    const result = board.sortRecords({
      aaa: {
        MP: 3,
        W: 2,
        D: 1,
        L: 1,
      },
      abb: {
        MP: 3,
        W: 2,
        D: 1,
        L: 1,
      },
      aba: {
        MP: 3,
        W: 2,
        D: 1,
        L: 1,
      },
    })
    expect(result[0].Name).toBe('aaa')
    expect(result[1].Name).toBe('aba')
  })

  test('log', () => {
    const normalInput = `
      Allegoric Alaskans;Blithering Badgers;win
      Devastating Donkeys;Courageous Californians;draw
      Devastating Donkeys;Allegoric Alaskans;win
      Courageous Californians;Blithering Badgers;loss
      Blithering Badgers;Devastating Donkeys;loss
      Allegoric Alaskans; Courageous Californians;win
    `
    const board = createScoreboard()
    board.record(normalInput)
    board.log()
  })
})
