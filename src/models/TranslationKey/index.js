// @flow
import path from 'path'
import { Model } from 'objection'
import Project from '@models/Project'
import TranslationValue from '@models/TranslationValue'

class TranslationKey extends Model {
  static tableName = 'translationKeys'
  static idColumn = 'id'
  static relationMappings = {
    project: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../Project'),
      join: {
        from: 'translationKeys.projectId',
        to: 'projects.id'
      }
    },
    translationValues: {
      relation: Model.HasManyRelation,
      modelClass: path.resolve(__dirname, '../TranslationValue'),
      join: {
        from: 'translationKeys.id',
        to: 'translationValues.translationKeyId'
      }
    }
  }

  id: string
  updatedAt: Date
  createdAt: Date
  key: string
  project: Project
  translationValues: Array<TranslationValue>

  constructor(key: string, project: Project) {
    super()
    this.key = key
    this.project = project
  }

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default TranslationKey
