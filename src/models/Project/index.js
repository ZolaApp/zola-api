// @flow
import path from 'path'
import { createHash } from 'crypto'
import { Model } from 'objection'
import User from '@models/User'
import Locale from '@models/Locale'
import TranslationKey from '@models/TranslationKey'
import Stats from '@models/Stats'
import TranslationValue from '@models/TranslationValue'
import type { TranslationKeyPage } from '@models/TranslationKey/getPaginatedTranslationKeys'

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

  static virtualAttributes = ['stats']

  id: number
  updatedAt: Date
  createdAt: Date
  name: string
  slug: string
  description: string
  owner: User
  locales: Array<Locale>
  translationKeys: TranslationKeyPage
  stats: Stats
  cdnToken: string

  createCdnToken() {
    const hash = createHash('sha256')
    const now = new Date().toISOString()
    this.cdnToken = hash.update(`${this.name}${this.id}${now}`).digest('hex')
  }

  hasOwnerId(ownerId: string): boolean {
    return this.ownerId === ownerId
  }

  async stats() {
    const translationKeysCount = await TranslationKey.query()
      .join('projects as p', 'translationKeys.projectId', 'p.id')
      .where('p.id', '=', this.id)
      .count()
      .pluck('count')
      .first()

    const localesCount = await Locale.query()
      .join('projects_locales as r', 'locales.id', 'r.localeId')
      .join('projects as p', 'r.projectId', 'p.id')
      .where('p.id', '=', this.id)
      .count()
      .pluck('count')
      .first()

    if (translationKeysCount === '0') {
      return new Stats({
        missingTranslationsCount: 0,
        newKeysCount: 0,
        completePercentage: 100,
        translationKeysCount: 0,
        localesCount,
        projectsCount: null
      })
    }

    const expectedTranslationValuesCount = translationKeysCount * localesCount
    const actualTranslationValuesCount = await TranslationValue.query()
      .join(
        'translationKeys as tk',
        'translationValues.translationKeyId',
        'tk.id'
      )
      .join('projects as p', 'tk.projectId', 'p.id')
      .where('p.id', '=', this.id)
      .count()
      .pluck('count')
      .first()

    const newKeysCount = await TranslationKey.query()
      .join('projects as p', 'translationKeys.projectId', 'p.id')
      .where('translationKeys.isNew', '=', true)
      .where('p.id', '=', this.id)
      .count()
      .pluck('count')
      .first()

    const missingTranslationsCount =
      expectedTranslationValuesCount -
      actualTranslationValuesCount -
      newKeysCount

    const completePercentage = Math.round(
      (actualTranslationValuesCount / expectedTranslationValuesCount) * 100
    )

    return new Stats({
      missingTranslationsCount,
      newKeysCount,
      completePercentage,
      translationKeysCount,
      localesCount,
      projectsCount: null
    })
  }

  $beforeInsert() {
    this.createdAt = new Date()
    this.createCdnToken()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default Project
