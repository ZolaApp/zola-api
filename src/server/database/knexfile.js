import dotenv from 'dotenv'

// Call dotenv again in case we’re running in the context of a knex command.
dotenv.config({ path: '../../../.env' })

export default {
  client: 'pg',
  version: '10',

  connection: {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  },

  debug:
    process.env.NODE_ENV === 'development' && process.env.NO_DEBUG !== 'true'
}
