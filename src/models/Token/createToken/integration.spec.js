import resetDatabase from '@tests/resetDatabase'
import database from '@database/index'
import createToken from './index'

describe('The User model’s `createToken` helper', () => {
  beforeAll(async done => {
    await resetDatabase()
    await database.migrate.latest()
    await database.seed.run()
    done()
  })

  it('should create and return a token for the user', async done => {
    const user = {
      id: 1,
      email: 'foo@bar.com'
    }
    const token = await createToken(user)

    expect(token.token).toBeDefined()
    expect(token.userId).toEqual(user.id)
    done()
  })
})
