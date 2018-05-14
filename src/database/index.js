// @flow
import knex from 'knex'
import { Model } from 'objection'
import knexfile from './knexfile'

const database = knex(knexfile)
Model.knex(database)

export default database
