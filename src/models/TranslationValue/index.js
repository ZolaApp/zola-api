// @flow
import path from 'path'
import { Model } from 'objection'
import TranslationKey from '@models/TranslationKey'
import Locale from '@models/Locale'

class TranslationValue extends Model {
  static tableName = 'translationValues'
  static idColumn = 'id'
  static relationMappings = {
    translationKey: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../TranslationKey'),
      join: {
        from: 'translationValues.translationKeyId',
        to: 'translationKeys.id'
      }
    },
    locale: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../Locale'),
      join: {
        from: 'translationValues.localeId',
        to: 'locales.id'
      }
    }
  }

  id: string
  updatedAt: Date
  createdAt: Date
  value: string
  translationKey: TranslationKey
  locale: Locale

  constructor(value: string, locale: Locale) {
    super()
    this.value = value
    this.locale = locale
  }

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default TranslationValue
