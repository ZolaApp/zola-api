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
