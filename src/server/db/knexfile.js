// This file must use `module.exports` for Knex to correctly import it.
module.exports = {
  client: 'pg',
  version: '10',

  connection: {
    host: 'postgres.host',
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  },

  debug: process.env.NODE_ENV === 'development'
}
