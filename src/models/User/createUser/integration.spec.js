import database from '@server/database'
import createUser from './index'

const user = {
  name: 'Foo',
  email: 'foo@bar.com',
  passwordPlain: '$uper$trongPa$$word'
}

describe('The User model’s `createUser` helper', () => {
  beforeAll(async () => {
    await database.migrate.latest()
  })

  beforeEach(async () => {
    await database('users').truncate()
  })

  it('should add a user to the database and return it', async done => {
    const countBefore = await database('users').count()
    const { user: createdUser } = await createUser(user)
    const countAfter = await database('users').count()

    expect(countBefore[0].count).toEqual('0')
    expect(countAfter[0].count).toEqual('1')
    expect(createdUser).toMatchObject({
      id: 1,
      name: 'Foo',
      email: 'foo@bar.com'
    })
    done()
  })

  it('should save a hash of the password and not the plain password', async done => {
    const { user: createdUser } = await createUser(user)
    const userKeys = Object.keys(createdUser)

    expect(userKeys).not.toContain('passwordPlain')
    expect(userKeys).toContain('passwordHash')
    done()
  })
})
