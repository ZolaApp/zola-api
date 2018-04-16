import database from '@server/database'
import {
  INVALID_EMAIL_ERROR,
  EMAIL_ALREADY_IN_USE_ERROR
} from './helpers/validateEmail'
import createUser from './index'

describe('The `createUser` mutation', () => {
  beforeAll(async () => {
    await database.migrate.latest()
  })

  beforeEach(async () => {
    await database('users').truncate()
  })

  it('should return errors if the name is not valid', async done => {
    const actual = await createUser(
      {},
      { name: 'A', email: '', passwordPlain: '' }
    )
    const expected = {
      field: 'name',
      message:
        'Your name is too short. It should be between 2 and 30 characters.'
    }

    expect(actual.errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the email is not valid', async done => {
    const actual = await createUser(
      {},
      { name: '', email: 'NOT_AN_EMAIL', passwordPlain: '' }
    )
    const expected = {
      field: 'email',
      message: INVALID_EMAIL_ERROR
    }

    expect(actual.errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the email is already in use', async done => {
    await database.seed.run()
    const actual = await createUser(
      {},
      { name: '', email: 'email@inuse.com', passwordPlain: '' }
    )
    const expected = {
      field: 'email',
      message: EMAIL_ALREADY_IN_USE_ERROR
    }

    expect(actual.errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the password is not valid', async done => {
    const actual = await createUser(
      {},
      { name: '', email: '', passwordPlain: 'password' }
    )
    const expected = {
      field: 'password',
      message:
        'This is a top-10 common password. Add another word or two. Uncommon words are better.'
    }

    expect(actual.errors).toContainEqual(expected)
    done()
  })

  it('should return the created user on success, with normalized and trimmed values', async done => {
    const actual = await createUser(
      {},
      {
        name: '  Foo   ',
        email: '  FOO@BaR.cOm  ',
        passwordPlain: '$uper$trongPa$$word'
      }
    )
    const expected = {
      user: {
        id: 1,
        name: 'Foo',
        email: 'foo@bar.com'
      }
    }

    expect(actual).toMatchObject(expected)
    done()
  })
})
