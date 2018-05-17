import database from '@database/index'
import createUser from '@models/User/createUser'
import resetDatabase from '@tests/resetDatabase'

const TEST_ACCOUNTS = [
  {
    firstName: 'Email in use',
    lastName: 'Account',
    job: 'Robot',
    email: 'email@inuse.com',
    passwordPlain: 'EMAIL_IN_USE_ACCOUNT'
  }
]

export const seed = async knex => {
  await resetDatabase()
  await database.migrate.latest()
  await Promise.all(TEST_ACCOUNTS.map(createUser))
}
