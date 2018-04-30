import gql from 'graphql-tag'
import testClient from '@tests/client'
import resetDatabase from '@tests/resetDatabase'
import database from '@database/index'

const mutation = gql`
  mutation($name: String!, $description: String, $userId: ID!) {
    createProject(name: $name, description: $description, userId: $userId) {
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
        userId: 1
      },
      mutation
    })
    const { project, errors } = projectResponse.data.createProject
    const expected = {
      __typename: 'Project',
      id: '1',
      name: 'My awesome project',
      slug: 'my-awesome-project',
      description: ''
    }

    expect(errors.length).toEqual(0)
    expect(project).toEqual(expected)
    done()
  })
})
