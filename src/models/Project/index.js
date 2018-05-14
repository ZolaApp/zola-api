// @flow
import path from 'path'
import { Model } from 'objection'
import User from '@models/User'

class Project extends Model {
  static tableName = 'projects'
  static idColumn = 'id'
  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../User'),
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

  id: string
  updatedAt: Date
  createdAt: Date
  name: string
  slug: string
  description: string
  owner: User

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default Project
