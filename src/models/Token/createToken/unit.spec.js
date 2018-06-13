import { generateToken } from './index'

describe('The `generateToken` helper', () => {
  it('should return a token longer than 40 characters when provided with an email', () => {
    const userEmail = 'test@zola.ink'
    const actual = generateToken(userEmail)

    expect(actual.length).toBeGreaterThan(40)
  })

  it('should return a token that is obfuscated (does not directly contain the email of the bearer)', () => {
    const userEmail = 'test@zola.ink'
    const token = generateToken(userEmail)

    expect(token.includes(userEmail)).toEqual(false)
  })
})
