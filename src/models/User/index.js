// @flow
import { Model } from 'objection'
import knex from '@database/index'
import Token from '@models/Token'
import Project from '@models/Project'

Model.knex(knex)

class User extends Model {
  static tableName = 'users'
  static idColumn = 'id'
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

  id: string
  updatedAt: Date
  createdAt: Date
  name: string
  email: string
  passwordHash: string
  isValidated: boolean
  token: Token
  projects: Array<Project>

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default User
