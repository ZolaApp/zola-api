// @flow
import path from 'path'
import { Model } from 'objection'
import User from '@models/User'
import Locale from '@models/Locale'
import TranslationKey from '@models/TranslationKey'

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
          from: 'projects_locales.projectId',
          to: 'projects_locales.localeId'
        },
        to: 'locales.id'
      }
    },
    translationKeys: {
      relation: Model.HasManyRelation,
      modelClass: path.resolve(__dirname, '../TranslationKey'),
      join: {
        from: 'projects.id',
        to: 'translationKeys.projectId'
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
  translationKeys: Array<TranslationKey>

  hasOwnerId(ownerId: string): boolean {
    return this.ownerId === ownerId
  }

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default Project
