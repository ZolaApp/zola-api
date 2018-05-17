import gql from 'graphql-tag'
import testClient from '@tests/client'
import resetDatabase from '@tests/resetDatabase'
import database from '@database/index'

const mutation = gql`
  mutation createUser(
    $firstName: String!
    $lastName: String!
    $job: String!
    $email: String!
    $passwordPlain: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      job: $job
      email: $email
      passwordPlain: $passwordPlain
    ) {
      status
      user {
        id
        firstName
        lastName
        fullName
        job
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
      variables: {
        firstName: '',
        lastName: '',
        job: '',
        email: '',
        passwordPlain: ''
      },
      mutation
    })
    const { status, user, errors } = response.data.createUser

    expect(status).toEqual('FAILURE')
    expect(user).toEqual(null)
    expect(errors.length).toEqual(5)
    done()
  })

  it('should return the created user on success, with normalized and trimmed values', async done => {
    const response = await testClient.mutate({
      variables: {
        firstName: '  Foo   ',
        lastName: ' Bar ',
        job: 'Baz',
        email: '  FOO@BaR.cOm  ',
        passwordPlain: '$uper$trongPa$$word'
      },
      mutation
    })
    const { status, user, errors } = response.data.createUser
    const expected = {
      __typename: 'User',
      id: '1',
      firstName: 'Foo',
      lastName: 'Bar',
      fullName: 'Foo Bar',
      job: 'Baz',
      email: 'foo@bar.com'
    }

    expect(status).toEqual('SUCCESS')
    expect(user).toEqual(expected)
    expect(errors.length).toEqual(0)
    done()
  })
})
