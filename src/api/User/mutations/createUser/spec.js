import database from '@server/database'
import createUser from './index'

describe('The `createUser` mutation', () => {
  beforeAll(async () => {
    await database('users').truncate()
    await database.migrate.latest()
  })

  it('should return an error if the name is not between 2 and 30 characters', async done => {
    const actualTooShort = await createUser(
      {},
      { name: 'A', email: '', passwordPlain: '' }
    )
    const expectedTooShort = {
      field: 'name',
      message:
        'Your name is too short. It should be between 2 and 30 characters.'
    }
    const actualTooLong = await createUser(
      {},
      { name: 'A'.repeat(31), email: '', passwordPlain: '' }
    )
    const expectedTooLong = {
      field: 'name',
      message:
        'Your name is too long. It should be between 2 and 30 characters.'
    }

    expect(actualTooShort.errors).toContainEqual(expectedTooShort)
    expect(actualTooLong.errors).toContainEqual(expectedTooLong)
    done()
  })

  it('should return errors if the email is not valid', async done => {
    const actual = await createUser(
      {},
      { name: '', email: 'NOT_AN_EMAIL', passwordPlain: '' }
    )
    const expected = {
      field: 'email',
      message: 'Your e-mail address does not seem to be valid.'
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
