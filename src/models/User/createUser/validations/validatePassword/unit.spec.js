import validatePassword from './index'

describe('The `validatePassword` helper', () => {
  it('should return an object with an `isValid` key set to `false` and some feedback for the user when the password is not secure enough', () => {
    const actual = validatePassword('password')
    const expected = {
      isValid: false,
      feedback:
        'This is a top-10 common password. Add another word or two. Uncommon words are better.'
    }

    expect(actual).toEqual(expected)
  })

  it('should return an object with an `isValid` key set to `true` and an empty string as feedback when the password is secure', () => {
    const actual = validatePassword('$uper$trongPa$$word')
    const expected = {
      isValid: true,
      feedback: ''
    }

    expect(actual).toEqual(expected)
  })
})
