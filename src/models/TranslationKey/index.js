// @flow
import path from 'path'
import { Model } from 'objection'
import Project from '@models/Project'
import TranslationValue from '@models/TranslationValue'
import Locale from '@models/Locale'

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

  static virtualAttributes = ['hasMissingTranslations']

  id: string
  updatedAt: Date
  createdAt: Date
  key: string
  project: Project
  translationValues: Array<TranslationValue>
  isNew: boolean
  hasMissingTranslations: boolean

  async hasMissingTranslations() {
    if (!this.id || this.isNew) {
      return false
    }

    const expectedTranslationValuesCount = await Locale.query()
      .join('projects_locales as pl', 'locales.id', 'pl.localeId')
      .join('projects as p', 'pl.projectId', 'p.id')
      .join('translationKeys as tk', 'p.id', 'tk.projectId')
      .where('tk.id', '=', this.id)
      .count()
      .pluck('count')
      .first()

    const actualTranslationValuesCount = await TranslationValue.query()
      .join(
        'translationKeys as tk',
        'translationValues.translationKeyId',
        'tk.id'
      )
      .where('tk.id', '=', this.id)
      .count()
      .pluck('count')
      .first()

    return expectedTranslationValuesCount > actualTranslationValuesCount
  }

  constructor(key: string) {
    super()
    this.key = key
  }

  $beforeInsert() {
    this.isNew = true
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default TranslationKey
