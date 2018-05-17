import resetDatabase from '@tests/resetDatabase'
import database from '@database/index'
import {
  INVALID_EMAIL_ERROR,
  EMAIL_ALREADY_IN_USE_ERROR
} from './validations/validateEmail'
import createUser from './index'

describe('The User model’s `createUser` helper', () => {
  beforeAll(async done => {
    await resetDatabase()
    await database.migrate.latest()
    done()
  })

  it('should return errors if the firstName is not valid', async done => {
    const { user, errors } = await createUser({
      firstName: 'F',
      lastName: '',
      job: '',
      email: '',
      passwordPlain: '',
      passwordConfirmation: ''
    })
    const expected = {
      field: 'firstName',
      message:
        'Your first name is too short. It should be between 2 and 30 characters.'
    }

    expect(user).toEqual(undefined)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the lastName is not valid', async done => {
    const { user, errors } = await createUser({
      firstName: '',
      lastName: 'O',
      job: '',
      email: '',
      passwordPlain: '',
      passwordConfirmation: ''
    })
    const expected = {
      field: 'lastName',
      message:
        'Your last name is too short. It should be between 2 and 30 characters.'
    }

    expect(user).toEqual(undefined)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the job is not valid', async done => {
    const { user, errors } = await createUser({
      firstName: '',
      lastName: '',
      job: 'O',
      email: '',
      passwordPlain: '',
      passwordConfirmation: ''
    })
    const expected = {
      field: 'job',
      message:
        'Your job is too short. It should be between 2 and 50 characters.'
    }

    expect(user).toEqual(undefined)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the email is not valid', async done => {
    const { user, errors } = await createUser({
      firstName: '',
      lastName: '',
      job: '',
      email: 'NOT_AN_EMAIL',
      passwordPlain: '',
      passwordConfirmation: ''
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
      firstName: '',
      lastName: '',
      job: '',
      email: 'email@inuse.com',
      passwordPlain: '',
      passwordConfirmation: ''
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
      firstName: '',
      lastName: '',
      job: '',
      email: '',
      passwordPlain: 'password',
      passwordConfirmation: ''
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

  it('should return errors if the passwords do not match', async done => {
    const { user, errors } = await createUser({
      firstName: '',
      lastName: '',
      job: '',
      email: '',
      passwordPlain: '$uper$trongPa$$word',
      passwordConfirmation: 'FOO_BAR'
    })
    const expected = {
      field: 'passwordConfirmation',
      message: 'Your two passwords do not match.'
    }

    expect(user).toEqual(undefined)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should add a user to the database and return it', async done => {
    const countBefore = await database('users').count()
    const password = '$uper$trongPa$$word'
    const { user } = await createUser({
      firstName: 'Foo',
      lastName: 'Bar',
      job: 'Baz',
      email: 'foo@bar.com',
      passwordPlain: password,
      passwordConfirmation: password
    })
    const countAfter = await database('users').count()

    expect(countBefore[0].count).toEqual('1')
    expect(countAfter[0].count).toEqual('2')
    expect(user).toMatchObject({
      id: 2,
      firstName: 'Foo',
      lastName: 'Bar',
      job: 'Baz',
      email: 'foo@bar.com'
    })
    done()
  })

  it('should save a hash of the password and not the plain password', async done => {
    const password = '$uper$trongPa$$word'
    const { user } = await createUser({
      firstName: 'Foo',
      lastName: 'Bar',
      job: 'Baz',
      email: 'foo3@bar.com',
      passwordPlain: password,
      passwordConfirmation: password
    })
    const userKeys = Object.keys(user)

    expect(userKeys).not.toContain('passwordPlain')
    expect(userKeys).toContain('passwordHash')
    done()
  })
})
