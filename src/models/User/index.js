// @flow
import path from 'path'
import { Model } from 'objection'
import Token from '@models/Token'
import Project from '@models/Project'

class User extends Model {
  static tableName = 'users'
  static idColumn = 'id'
  static relationMappings = {
    token: {
      relation: Model.HasOneRelation,
      modelClass: path.resolve(__dirname, '../Token'),
      join: {
        from: 'users.id',
        to: 'tokens.userId'
      }
    },
    projects: {
      relation: Model.HasManyRelation,
      modelClass: path.resolve(__dirname, '../Project'),
      join: {
        from: 'users.id',
        to: 'projects.ownerId'
      }
    }
  }

  id: string
  updatedAt: Date
  createdAt: Date
  firstName: string
  lastName: string
  email: string
  job: string
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
