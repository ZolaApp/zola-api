// @flow
import knex from 'knex'
import knexfile from './knexfile'

const database = knex(knexfile)

export default database
