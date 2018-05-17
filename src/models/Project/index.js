// @flow
import path from 'path'
import { Model } from 'objection'
import User from '@models/User'
import Locale from '@models/Locale'

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
    },
    locales: {
      relation: Model.ManyToManyRelation,
      modelClass: path.resolve(__dirname, '../Locale'),
      join: {
        from: 'projects.id',
        through: {
          from: 'project_locale.projectId',
          to: 'project_locale.localeId'
        },
        to: 'locales.id'
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
  locales: Array<Locale>

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default Project
