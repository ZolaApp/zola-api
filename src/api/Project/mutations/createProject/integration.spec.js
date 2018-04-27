import gql from 'graphql-tag'
import testClient from '@tests/client'
import database from '@server/database'
import resetDatabase from '@tests/resetDatabase'

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
  beforeAll(async () => {
    await resetDatabase()
    await database.migrate.latest()
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
      name: 'My awesome project'
    }

    expect(errors.length).toEqual(0)
    expect(project).toMatchObject(expected)
    done()
  })
})
