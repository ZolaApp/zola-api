import validateEmail, {
  INVALID_ADDRESS_ERROR,
  EMAIL_ALREADY_IN_USE_ERROR
} from './index'
import database from '@server/database'

describe('The `validateEmail` helper', () => {
  beforeAll(async () => {
    await database.migrate.latest()
    await database.seed.run()
  })

  it('should return an object with an `isValid` key set to `false` and an `INVALID_ADDRESS` error when the e-mail is not correct', async done => {
    const invalidEmails = ['NOT_AN_EMAIL', 'foo@bar.NOT_A_TLD', 'foo@bar']
    const results = await Promise.all(invalidEmails.map(validateEmail))
    const expected = {
      isValid: false,
      errors: [INVALID_ADDRESS_ERROR]
    }

    results.forEach(actual => {
      expect(actual).toEqual(expected)
    })

    done()
  })

  it('should return an object with an `isValid` key set to `false` and an `EMAIL_ALREADY_IN_USE` error when the e-mail is already in use', async done => {
    const actual = await validateEmail('email@inuse.com')
    const expected = {
      isValid: false,
      errors: [EMAIL_ALREADY_IN_USE_ERROR]
    }

    expect(actual).toEqual(expected)
    done()
  })

  it('should return an object with an `isValid` key set to `true` and an empty errors array when the e-mail is valid', async done => {
    const actual = await validateEmail('foo@bar.com')
    const expected = {
      isValid: true,
      errors: []
    }

    expect(actual).toEqual(expected)
    done()
  })
})
