// @flow
import Project from '@models/Project'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'
import TranslationValue from '@models/TranslationValue'
import TranslationKey from '@models/TranslationKey'
import Locale from '@models/Locale'
import getPaginatedTranslationKeys from '@models/TranslationKey/getPaginatedTranslationKeys'

type Context = {
  request: express$Request
}

type GetProjectArgs = {
  projectSlug: string,
  pageSize: number,
  page: number,
  filters: [?string],
  search: ?string
}

const resolver = async (
  _: any,
  { projectSlug, pageSize, page, filters, search }: GetProjectArgs,
  { request }: Context
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const project: Project = await Project.query().findOne({
    slug: projectSlug,
    ownerId: request.user.id
  })

  if (!project) {
    throw new Error('This project was not found')
  }

  project.locales = await Locale.query()
    .join('projects_locales as pl', 'pl.localeId', 'locales.id')
    .join('projects as p', 'pl.projectId', 'p.id')
    .where('p.id', '=', project.id)
    .orderBy('pl.id', 'ASC')

  project.translationKeyPage = await getPaginatedTranslationKeys({
    pageSize,
    page,
    projectId: project.id,
    filters,
    search
  })

  await Promise.all(
    project.locales.map(async locale => {
      const expectedTranslationValues = await TranslationKey.query()
        .where('projectId', '=', project.id)
        .count()
        .pluck('count')
        .first()

      const actualTranslationValues = await TranslationValue.query()
        .join('locales as l', 'translationValues.localeId', 'l.id')
        .join(
          'translationKeys as tk',
          'translationValues.translationKeyId',
          'tk.id'
        )
        .where('l.id', '=', locale.id)
        .andWhere('tk.projectId', '=', project.id)
        .count()
        .pluck('count')
        .first()

      const newKeysCount = await TranslationKey.query()
        .join('projects as p', 'translationKeys.projectId', 'p.id')
        .join('projects_locales as pl', 'pl.projectId', 'p.id')
        .join('locales as l', 'pl.localeId', 'l.id')
        .where('l.id', '=', locale.id)
        .andWhere('p.id', '=', project.id)
        .andWhere('isNew', '=', true)
        .count()
        .pluck('count')
        .first()

      locale.missingTranslations =
        expectedTranslationValues - actualTranslationValues - newKeysCount
      locale.completePercentage =
        expectedTranslationValues > 0
          ? Math.floor(
              (actualTranslationValues / expectedTranslationValues) * 100
            )
          : 100

      return locale
    })
  )

  return project
}

export default resolver
