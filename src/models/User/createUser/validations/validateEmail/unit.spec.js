import validateEmail, {
  INVALID_EMAIL_ERROR,
  EMAIL_ALREADY_IN_USE_ERROR
} from './index'

describe('The `validateEmail` helper', () => {
  it('should return an object with an `isValid` key set to `false` and an `INVALID_ADDRESS` error when the e-mail is not correct', () => {
    const invalidEmails = ['NOT_AN_EMAIL', 'foo@bar.NOT_A_TLD', 'foo@bar']
    const results = invalidEmails.map(email => validateEmail(email, false))
    const expected = {
      isValid: false,
      errors: [INVALID_EMAIL_ERROR]
    }

    results.forEach(actual => {
      expect(actual).toEqual(expected)
    })
  })

  it('should return an object with an `isValid` key set to `false` and an `EMAIL_ALREADY_IN_USE` error when the e-mail is already in use', () => {
    const email = 'email@inuse.com'
    const actual = validateEmail(email, true)
    const expected = {
      isValid: false,
      errors: [EMAIL_ALREADY_IN_USE_ERROR]
    }

    expect(actual).toEqual(expected)
  })

  it('should return an object with an `isValid` key set to `true` and an empty errors array when the e-mail is valid', () => {
    const actual = validateEmail('foo@bar.com', false)
    const expected = {
      isValid: true,
      errors: []
    }

    expect(actual).toEqual(expected)
  })
})
