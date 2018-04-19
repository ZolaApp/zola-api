import database from '@server/database'
import {
  INVALID_EMAIL_ERROR,
  EMAIL_ALREADY_IN_USE_ERROR
} from './validations/validateEmail'
import createUser from './index'

const validUser = {
  name: 'Foo',
  email: 'foo@bar.com',
  passwordPlain: '$uper$trongPa$$word'
}

describe('The User model’s `createUser` helper', () => {
  beforeAll(async () => {
    await database.migrate.latest()
  })

  beforeEach(async () => {
    await database('users').truncate()
  })

  it('should return errors if the name is not valid', async done => {
    const { user, errors } = await createUser({
      name: 'F',
      email: '',
      passwordPlain: ''
    })
    const expected = {
      field: 'name',
      message:
        'Your name is too short. It should be between 2 and 30 characters.'
    }

    expect(user).toEqual(undefined)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the email is not valid', async done => {
    const { user, errors } = await createUser({
      name: '',
      email: 'NOT_AN_EMAIL',
      passwordPlain: ''
    })
    const expected = {
      field: 'email',
      message: INVALID_EMAIL_ERROR
    }

    expect(user).toEqual(undefined)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the email is already in use', async done => {
    await database.seed.run()
    const { user, errors } = await createUser({
      name: '',
      email: 'email@inuse.com',
      passwordPlain: ''
    })
    const expected = {
      field: 'email',
      message: EMAIL_ALREADY_IN_USE_ERROR
    }

    expect(user).toEqual(undefined)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the password is not valid', async done => {
    const { user, errors } = await createUser({
      name: '',
      email: '',
      passwordPlain: 'password'
    })
    const expected = {
      field: 'password',
      message:
        'This is a top-10 common password. Add another word or two. Uncommon words are better.'
    }

    expect(user).toEqual(undefined)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should add a user to the database and return it', async done => {
    const countBefore = await database('users').count()
    const { user } = await createUser(validUser)
    const countAfter = await database('users').count()

    expect(countBefore[0].count).toEqual('0')
    expect(countAfter[0].count).toEqual('1')
    expect(user).toMatchObject({
      id: 1,
      name: 'Foo',
      email: 'foo@bar.com'
    })
    done()
  })

  it('should save a hash of the password and not the plain password', async done => {
    const { user } = await createUser(validUser)
    const userKeys = Object.keys(user)

    expect(userKeys).not.toContain('passwordPlain')
    expect(userKeys).toContain('passwordHash')
    done()
  })
})
