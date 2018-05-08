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

  static get tableName(): string {
    return 'projects'
  }

  static get idColumn(): string {
    return 'id'
  }

  updatedAt: Date
  createdAt: Date
  name: string
  slug: string
  description: string
  owner: User

  static get relationMappings(): any {
    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'projects.ownerId',
          to: 'users.id'
        }
      }
    }
  }

  static get jsonSchema(): any {
    return {
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
}

export default Project
