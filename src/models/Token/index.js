// @flow
import path from 'path'
import { Model } from 'objection'
import User from '@models/User'

class Token extends Model {
  static tableName = 'tokens'
  static idColumn = 'id'
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../User'),
      join: {
        from: 'tokens.userId',
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
      token: { type: 'string' }
    }
  }

  id: string
  updatedAt: Date
  createdAt: Date
  token: string
  user: User

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default Token
