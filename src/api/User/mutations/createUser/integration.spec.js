import gql from 'graphql-tag'
import testClient from '@tests/client'
import database from '@server/database'
import {
  INVALID_EMAIL_ERROR,
  EMAIL_ALREADY_IN_USE_ERROR
} from './helpers/validateEmail'

describe('The `createUser` mutation', () => {
  beforeAll(async () => {
    await database.migrate.latest()
  })

  beforeEach(async () => {
    await database('users').truncate()
  })

  it('should return errors if the name is not valid', async done => {
    const response = await testClient.mutate({
      variables: { name: 'A', email: '', password: '' },
      mutation: gql`
        mutation($email: String!, $name: String!, $password: String!) {
          createUser(email: $email, name: $name, passwordPlain: $password) {
            user {
              id
              name
              email
            }
            errors {
              field
              message
            }
          }
        }
      `
    })
    const { user, errors } = response.data.createUser
    const expected = {
      __typename: 'ValidationError',
      field: 'name',
      message:
        'Your name is too short. It should be between 2 and 30 characters.'
    }

    expect(user).toBe(null)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the email is not valid', async done => {
    const response = await testClient.mutate({
      variables: { name: '', email: 'NOT_AN_EMAIL', password: '' },
      mutation: gql`
        mutation($email: String!, $name: String!, $password: String!) {
          createUser(email: $email, name: $name, passwordPlain: $password) {
            user {
              id
              name
              email
            }
            errors {
              field
              message
            }
          }
        }
      `
    })
    const { user, errors } = response.data.createUser
    const expected = {
      __typename: 'ValidationError',
      field: 'email',
      message: INVALID_EMAIL_ERROR
    }

    expect(user).toBe(null)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the email is already in use', async done => {
    await database.seed.run()
    const response = await testClient.mutate({
      variables: { name: '', email: 'email@inuse.com', password: '' },
      mutation: gql`
        mutation($email: String!, $name: String!, $password: String!) {
          createUser(email: $email, name: $name, passwordPlain: $password) {
            user {
              id
              name
              email
            }
            errors {
              field
              message
            }
          }
        }
      `
    })
    const { user, errors } = response.data.createUser
    const expected = {
      __typename: 'ValidationError',
      field: 'email',
      message: EMAIL_ALREADY_IN_USE_ERROR
    }

    expect(user).toBe(null)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return errors if the password is not valid', async done => {
    const response = await testClient.mutate({
      variables: { name: '', email: '', password: 'password' },
      mutation: gql`
        mutation($email: String!, $name: String!, $password: String!) {
          createUser(email: $email, name: $name, passwordPlain: $password) {
            user {
              id
              name
              email
            }
            errors {
              field
              message
            }
          }
        }
      `
    })
    const { user, errors } = response.data.createUser
    const expected = {
      __typename: 'ValidationError',
      field: 'password',
      message:
        'This is a top-10 common password. Add another word or two. Uncommon words are better.'
    }

    expect(user).toBe(null)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should return the created user on success, with normalized and trimmed values', async done => {
    const response = await testClient.mutate({
      variables: {
        name: '  Foo   ',
        email: '  FOO@BaR.cOm  ',
        password: '$uper$trongPa$$word'
      },
      mutation: gql`
        mutation($email: String!, $name: String!, $password: String!) {
          createUser(email: $email, name: $name, passwordPlain: $password) {
            user {
              id
              name
              email
            }
            errors {
              field
              message
            }
          }
        }
      `
    })
    const { user, errors } = response.data.createUser
    const expected = {
      __typename: 'User',
      id: '1',
      name: 'Foo',
      email: 'foo@bar.com'
    }

    expect(errors.length).toBe(0)
    expect(user).toEqual(expected)
    done()
  })
})
