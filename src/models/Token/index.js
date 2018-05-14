// @flow
import { Model } from 'objection'
import User from '@models/User'

class Token extends Model {
  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static get tableName(): string {
    return 'tokens'
  }

  static get idColumn(): string {
    return 'id'
  }

  id: string
  updatedAt: Date
  createdAt: Date
  token: string
  user: User

  static get relationMappings(): any {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tokens.userId',
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
        token: { type: 'string' }
      }
    }
  }
}

export default Token
