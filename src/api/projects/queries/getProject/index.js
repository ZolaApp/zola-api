// @flow
import Project from '@models/Project'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'
import TranslationKey from '@models/TranslationKey'
import TranslationValue from '@models/TranslationValue'
import Stats from '@models/Stats'

type Context = {
  request: express$Request
}

type GetProjectArgs = {
  projectSlug: string
}

const resolver = async (
  _: any,
  { projectSlug }: GetProjectArgs,
  { request }: Context
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const project = await Project.query()
    .eager(
      '[locales, translationKeys.translationValues, translationKeys.translationValues.locale]'
    )
    .findOne({ slug: projectSlug, ownerId: request.user.id })

  if (!project) {
    throw new Error('This project was not found')
  }

  const translationKeysCount = project.translationKeys.length
  const localesCount = project.locales.length

  if (translationKeysCount === 0) {
    project.stats = new Stats(0, 0, 100, localesCount)

    return project
  }

  const expectedTranslationValuesCount = translationKeysCount * localesCount
  const actualTranslationValuesCount = await TranslationValue.query()
    .join(
      'translationKeys as tk',
      'translationValues.translationKeyId',
      'tk.id'
    )
    .join('projects as p', 'tk.projectId', 'p.id')
    .where('p.id', '=', project.id)
    .count()
    .pluck('count')
    .first()

  const missingTranslationsCount =
    expectedTranslationValuesCount - actualTranslationValuesCount

  const completePercentage =
    expectedTranslationValuesCount > 0
      ? Math.round(
          (actualTranslationValuesCount / expectedTranslationValuesCount) * 100
        )
      : 100

  const newKeysCount = await TranslationKey.query()
    .join('projects as p', 'translationKeys.projectId', 'p.id')
    .where('translationKeys.isNew', '=', true)
    .count()
    .pluck('count')
    .first()

  project.stats = new Stats(
    missingTranslationsCount,
    newKeysCount,
    completePercentage,
    localesCount
  )

  return project
}

export default resolver
