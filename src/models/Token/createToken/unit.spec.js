import { createTokenString } from './index'

describe('The `createTokenString` helper', () => {
  it('should return a token longer than 40 characters when provided with an email', () => {
    const userEmail = 'test@zola.ink'
    const actual = createTokenString(userEmail)

    expect(actual.length).toBeGreaterThan(40)
  })

  it('should return a token that is obfuscated (does not directly contain the email of the bearer)', () => {
    const userEmail = 'test@zola.ink'
    const actual = createTokenString(userEmail)

    const search = actual.search(userEmail)

    expect(search).toEqual(-1)
  })
})
