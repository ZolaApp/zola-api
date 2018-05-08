// @flow
import { Model } from 'objection'
import knex from '@database/index'
import User from '@models/Token'

Model.knex(knex)

class Project extends Model {
  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static tableName: string = 'projects'

  static idColumn: string = 'id'

  updatedAt: Date
  createdAt: Date
  name: string
  slug: string
  description: string
  owner: User

  static relationMappings = {
    owner: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: 'projects.ownerId',
        to: 'users.id'
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
      slug: { type: 'string' }
    }
  }
}

export default Project
