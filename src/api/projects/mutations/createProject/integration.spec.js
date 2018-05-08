import gql from 'graphql-tag'
import testClient from '@tests/client'
import resetDatabase from '@tests/resetDatabase'
import database from '@database/index'

const mutation = gql`
  mutation($name: String!, $description: String, $ownerId: ID!) {
    createProject(name: $name, description: $description, ownerId: $ownerId) {
      status
      project {
        id
        name
        slug
        description
      }
      errors {
        field
        message
      }
    }
  }
`

describe('The `createProject` mutation', () => {
  beforeAll(async done => {
    await resetDatabase()
    await database.migrate.latest()
    done()
  })

  it('should return the created project on success, with normalized and trimmed values', async done => {
    await database.seed.run()
    const projectResponse = await testClient.mutate({
      variables: {
        name: 'My awesome project',
        ownerId: 1
      },
      mutation
    })
    const { status, project, errors } = projectResponse.data.createProject
    const expected = {
      __typename: 'Project',
      id: '1',
      name: 'My awesome project',
      slug: 'my-awesome-project',
      description: ''
    }

    expect(status).toEqual('SUCCESS')
    expect(errors.length).toEqual(0)
    expect(project).toEqual(expected)
    done()
  })
})
