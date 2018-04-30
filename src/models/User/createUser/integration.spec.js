import resetDatabase from '@tests/resetDatabase'
import database from '@database/index'
import UserModel from '@models/User'
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
    const { user } = await createUser({
      name: 'Foo',
      email: 'foo@bar.com',
      passwordPlain: '$uper$trongPa$$word'
    })
    const countAfter = await database('users').count()

    expect(countBefore[0].count).toEqual('1')
    expect(countAfter[0].count).toEqual('2')
    expect(user).toMatchObject({
      id: 2,
      email: 'foo@bar.com',
      name: 'Foo',
      updatedAt: null,
      isValidated: false
    })
    done()
  })

  it('should send a validation e-mail to the user', async done => {
    const sendValidationEmailSpy = jest.spyOn(UserModel, 'sendValidationEmail')
    await createUser({
      name: 'Foo',
      email: 'foo2@bar.com',
      passwordPlain: '$uper$trongPa$$word'
    })

    expect(sendValidationEmailSpy).toHaveBeenCalled()
    done()
  })

  it('should save a hash of the password and not the plain password', async done => {
    const { user } = await createUser({
      name: 'Foo',
      email: 'foo3@bar.com',
      passwordPlain: '$uper$trongPa$$word'
    })
    const userKeys = Object.keys(user)

    expect(userKeys).not.toContain('passwordPlain')
    expect(userKeys).toContain('passwordHash')
    done()
  })
})
