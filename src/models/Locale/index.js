// @flow
import path from 'path'
import { Model } from 'objection'
import Project from '@models/Project'
import TranslationValue from '@models/TranslationValue'

class Locale extends Model {
  static tableName = 'locales'
  static idColumn = 'id'
  static relationMappings = {
    projects: {
      relation: Model.ManyToManyRelation,
      modelClass: path.resolve(__dirname, '../Project'),
      join: {
        from: 'locales.id',
        through: {
          from: 'projects_locales.localeId',
          to: 'projects_locales.projectId'
        },
        to: 'projects.id'
      }
    },
    translationValues: {
      relation: Model.HasManyRelation,
      modelClass: path.resolve(__dirname, '../TranslationValue'),
      join: {
        from: 'users.id',
        to: 'projects.ownerId'
      }
    }
  }

  id: string
  updatedAt: Date
  createdAt: Date
  code: string
  name: string
  projects: Array<Project>
  translationValues: Array<TranslationValue>

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default Locale
