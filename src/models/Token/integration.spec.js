import resetDatabase from '@tests/resetDatabase'
import database from '@database/index'
import { createToken, retrieveToken, validateToken } from './index'

describe('The Token model helpers', () => {
  beforeAll(async done => {
    await resetDatabase()
    await database.migrate.latest()
    done()
  })

  it("should return errors if the user doesn't exist", async done => {
    const { token, errors } = await createToken()
    const expected = { field: 'user', message: 'User should be defined' }

    expect(token).toEqual(undefined)
    expect(errors).toContainEqual(expected)
    done()
  })

  it('should add a token to the database and return it', async done => {
    await database.seed.run()

    const testUser = await database('users').where({ id: 1 })
    const countBefore = await database('tokens').count()
    const { token } = await createToken(testUser)
    const countAfter = await database('users').count()

    expect(countBefore[0].count).toEqual('0')
    expect(countAfter[0].count).toEqual('1')
    expect(token).toMatchObject({
      id: 1,
      userId: 1
    })
    done()
  })

  it('should be able to retreive an existing token', async done => {
    await database.seed.run()

    const testUser = await database('users').where({ id: 1 })
    const { token } = await createToken(testUser)
    const receivedToken = await retrieveToken(testUser)

    expect(receivedToken).toEqual(token)
    done()
  })

  it('should be able to validate an existing token', async done => {
    await database.seed.run()

    const testUser = await database('users').where({ id: 1 })
    const { token } = await createToken(testUser)
    const isValidated = await validateToken(token)

    expect(isValidated).toEqual(true)
    done()
  })
})
