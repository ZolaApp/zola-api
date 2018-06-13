import path from 'path'
import dotenv from 'dotenv'

// Call dotenv again in case we’re in the context of a knex command.
// We need to specify a path since the current working directory is not the root
// directory.
dotenv.config({ path: '../../.env' })

const connection = process.env.NODE_ENV === 'preprod'
  ? `${process.env.DATABASE_URL}?ssl=true`
  : {
    host: process.env.POSTGRES_HOST,
    database:
      process.env.NODE_ENV === 'test'
        ? 'zola-test'
        : process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  }


export default {
  client: 'pg',
  version: '10',
  connection,
  migrations: {
    directory: path.join(__dirname, 'migrations')
  },

  seeds: {
    directory: path.join(__dirname, `seeds/${process.env.NODE_ENV}`)
  },

  debug:
    process.env.NODE_ENV === 'development' && process.env.NO_DEBUG !== 'true'
}
