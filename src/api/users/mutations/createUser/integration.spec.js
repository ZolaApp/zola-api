import gql from 'graphql-tag'
import testClient from '@tests/client'
import resetDatabase from '@tests/resetDatabase'
import database from '@database/index'

const mutation = gql`
  mutation($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, name: $name, passwordPlain: $password) {
      status
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
  beforeAll(async done => {
    await resetDatabase()
    await database.migrate.latest()
    done()
  })

  it('should return errors', async done => {
    const response = await testClient.mutate({
      variables: { name: '', email: '', password: '' },
      mutation
    })
    const { status, user, errors } = response.data.createUser

    expect(status).toEqual('FAILURE')
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
    const { status, user, errors } = response.data.createUser
    const expected = {
      __typename: 'User',
      id: '1',
      name: 'Foo',
      email: 'foo@bar.com'
    }

    expect(status).toEqual('SUCCESS')
    expect(user).toEqual(expected)
    expect(errors.length).toEqual(0)
    done()
  })
})
