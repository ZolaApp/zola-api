import knex from 'knex'

const database = knex({
  client: 'pg',
  version: '10',

  connection: {
    host: 'postgres.host',
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  },

  debug: process.env.NODE_ENV === 'development'
})

export default database
