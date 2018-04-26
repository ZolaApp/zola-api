import gql from 'graphql-tag'
import testClient from '@tests/client'
import database from '@server/database'
import resetDatabase from '@tests/resetDatabase'

export const mutation = gql`
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

describe('The `createUser` mutation', () => {
  beforeAll(async () => {
    await resetDatabase()
    await database.migrate.latest()
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
      name: 'Foo',
      email: 'foo@bar.com'
    }

    expect(errors.length).toEqual(0)
    expect(user).toEqual(expected)
    done()
  })
})
