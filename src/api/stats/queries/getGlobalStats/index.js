// @flow
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'
import Project from '@models/Project'
import Locale from '@models/Locale'
import Stats from '@models/Stats'

type Context = {
  request: express$Request
}

const resolver = async (_: any, args: any, { request }: Context) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const projects: Array<Project> = await Project.query().where(
    'ownerId',
    '=',
    request.user.id
  )

  const projectsCount = projects.length

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

  let totalMissingTranslationsCount = 0
  let totalNewKeysCount = 0
  let totalTranslationKeysCount = 0
  let totalExpectedValues = 0

  const totalLocalesCount = await Locale.query()
    .join('projects_locales as pl', 'locales.id', 'pl.localeId')
    .join('projects as p', 'pl.projectId', 'p.id')
    .where('p.ownerId', '=', request.user.id)
    .count()
    .pluck('count')
    .first()

  await Promise.all(
    projects.map(async project => {
      // $FlowFixMe
      const projectStats: Stats = await project.stats()

      totalNewKeysCount += Number(projectStats.newKeysCount)
      totalMissingTranslationsCount += Number(
        projectStats.missingTranslationsCount
      )
      totalTranslationKeysCount += Number(projectStats.translationKeysCount)
      totalExpectedValues += Number(
        projectStats.translationKeysCount * (projectStats.localesCount || 0)
      )
    })
  )

  const actualNumberOfValues = Number(
    totalExpectedValues - totalMissingTranslationsCount
  )
  const completePercentage = Number(
    Math.round((actualNumberOfValues / totalExpectedValues) * 100)
  )

  const stats = new Stats({
    missingTranslationsCount: totalMissingTranslationsCount,
    newKeysCount: totalNewKeysCount,
    completePercentage: completePercentage || 0,
    translationKeysCount: totalTranslationKeysCount,
    localesCount: totalLocalesCount,
    projectsCount
  })

  return stats
}

export default resolver
