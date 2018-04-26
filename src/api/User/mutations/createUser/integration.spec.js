import gql from 'graphql-tag'
import testClient from '@tests/client'
import database from '@database/index'

const mutation = gql`
  mutation($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, name: $name, passwordPlain: $password) {
      user {
        id
        isValidated
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

describe('The `createUser` mutation', () => {
  beforeAll(async done => {
    await database.migrate.latest()
    await database('users').truncate()
    done()
  })

  it('should return errors', async done => {
    const response = await testClient.mutate({
      variables: { name: '', email: '', password: '' },
      mutation
    })
    const { user, errors } = response.data.createUser

    expect(user).toEqual(null)
    expect(errors.length).toEqual(3)
    done()
  })

  it('should return the created user on success, with normalized and trimmed values', async done => {
    const response = await testClient.mutate({
      variables: {
        name: '  Foo   ',
        email: '  FOO@BaR.cOm  ',
        password: '$uper$trongPa$$word'
      },
      mutation
    })
    const { user, errors } = response.data.createUser
    const expected = {
      __typename: 'User',
      id: '1',
      isValidated: false,
      name: 'Foo',
      email: 'foo@bar.com'
    }

    expect(errors.length).toEqual(0)
    expect(user).toEqual(expected)
    done()
  })
})
