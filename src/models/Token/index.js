// @flow
import { Model } from 'objection'
import User from '@models/User'

class Token extends Model {
  $beforeInsert() {
    this.createdAt = new Date().toISOString()
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }

  static tableName: string = 'tokens'

  static idColumn: string = 'id'

  static updatedAt: Date
  static createdAt: Date
  static token: string

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
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
}

export default Token
