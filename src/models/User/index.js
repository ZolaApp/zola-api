// @flow
import { Model } from 'objection'
import knex from '@database/index'
import Token from '@models/Token'
import Project from '@models/Project'

Model.knex(knex)

class User extends Model {
  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static tableName: string = 'users'

  static idColumn: string = 'id'

  updatedAt: Date
  createdAt: Date
  name: string
  email: string
  passwordHash: string
  isValidated: boolean
  token: Token
  projects: Array<Project>

  static relationMappings = {
    token: {
      relation: Model.HasOneRelation,
      modelClass: Token,
      join: {
        from: 'users.id',
        to: 'tokens.userId'
      }
    },
    projects: {
      relation: Model.HasManyRelation,
      modelClass: Project,
      join: {
        from: 'users.id',
        to: 'projects.ownerId'
      }
    }
  }

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
      name: { type: 'string' },
      email: { type: 'string' },
      passwordHash: { type: 'string' },
      isValidated: { type: 'boolean' }
    }
  }
}

export default User
