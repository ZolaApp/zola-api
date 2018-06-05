// @flow
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'
import Project from '@models/Project'
import Locale from '@models/Locale'
import TranslationValue from '@models/TranslationValue'
import TranslationKey from '@models/TranslationKey'
import Stats from '@models/Stats'

type Context = {
  request: express$Request
}

const resolver = async (_: any, args: any, { request }: Context) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const projectsCount = await Project.query()
    .where('ownerId', '=', request.user.id)
    .count()
    .pluck('count')
    .first()

  if (projectsCount === 0) {
    return new Stats({
      missingTranslationsCount: 0,
      newKeysCount: 0,
      completePercentage: 0,
      translationKeysCount: 0,
      localesCount: 0,
      projectsCount: 0
    })
  }

  const localesCount = await Locale.query()
    .join('projects_locales as pl', 'locales.id', 'pl.localeId')
    .join('projects as p', 'pl.projectId', 'p.id')
    .where('p.ownerId', '=', request.user.id)
    .count()
    .pluck('count')
    .first()

  // To check for missing translations, we count the number of keys, the number of values, and check whether it matches.
  const translationKeysCount = await TranslationKey.query()
    .join('projects as p', 'translationKeys.projectId', 'p.id')
    .where('p.ownerId', '=', request.user.id)
    .count()
    .pluck('count')
    .first()

  const expectedTranslationValuesCount = translationKeysCount * localesCount
  const actualTotalTranslationValuesCount = await TranslationValue.query()
    .join(
      'translationKeys as tk',
      'translationValues.translationKeyId',
      'tk.id'
    )
    .join('projects as p', 'tk.projectId', 'p.id')
    .where('p.ownerId', '=', request.user.id)
    .count()
    .pluck('count')
    .first()

  const newKeysCount = await TranslationKey.query()
    .join('projects as p', 'translationKeys.projectId', 'p.id')
    .where('translationKeys.isNew', '=', true)
    .andWhere('p.ownerId', '=', request.user.id)
    .count()
    .pluck('count')
    .first()

  const missingTranslationsCount =
    expectedTranslationValuesCount -
    actualTotalTranslationValuesCount -
    newKeysCount
  const completePercentage = Math.round(
    (actualTotalTranslationValuesCount / expectedTranslationValuesCount) * 100
  )

  const stats = new Stats({
    missingTranslationsCount,
    newKeysCount,
    completePercentage: completePercentage || 0,
    translationKeysCount,
    localesCount,
    projectsCount
  })

  return stats
}

export default resolver
