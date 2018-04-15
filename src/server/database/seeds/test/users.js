import User from '@models/User'

const TEST_ACCOUNTS = [
  {
    name: 'Email in use account',
    email: 'email@inuse.com',
    passwordPlain: 'EMAIL_IN_USE_ACCOUNT'
  }
]

export const seed = async knex => {
  await knex('users').del()
  await Promise.all(TEST_ACCOUNTS.map(User.createUser))
}
