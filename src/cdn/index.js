// @flow
import Project from '@models/Project'
import Locale from '@models/Locale'
import TranslationKey from '@models/TranslationKey'

export default async (
  request: express$Request,
  response: express$Response,
  next: express$NextFunction
) => {
  const { cdnToken, localeCode } = request.params
  const isDownload = request.path.includes('download')
  const project = await Project.query().findOne({ cdnToken })
  let resultKeys

  if (!project) {
    return response.status(404).send('This project wasn’t found')
  }

  if (!isDownload) {
    const locale = await Locale.query().findOne({ code: localeCode })

    if (!locale) {
      return response.status(404).send('This locale doesn’t exist')
    }

    const isLocaleActivated =
      (await Locale.query()
        .join('projects_locales as r', 'locales.id', 'r.localeId')
        .join('projects as p', 'r.projectId', 'p.id')
        .where('locales.id', '=', locale.id)
        .andWhere('p.id', '=', project.id)
        .count()
        .pluck('count')
        .first()) !== '0'

    if (!isLocaleActivated) {
      return response
        .status(404)
        .send('This locale is not activated for this project')
    }

    const keysValues = await TranslationKey.query()
      .select('translationKeys.key', 'v.value')
      .join(
        'translationValues as v',
        'translationKeys.id',
        'v.translationKeyId'
      )
      .where('translationKeys.projectId', '=', project.id)
      .andWhere('v.localeId', '=', locale.id)

    resultKeys = keysValues.reduce((acc, row) => {
      acc[row.key] = row.value

      return acc
    }, {})
  } else {
    const keysValues = await TranslationKey.query()
      .select('translationKeys.key', 'v.value')
      .join(
        'translationValues as v',
        'translationKeys.id',
        'v.translationKeyId'
      )
      .where('translationKeys.projectId', '=', project.id)

    resultKeys = keysValues

    response.set('Content-Disposition', 'attachment; filename=export.json')
    response.set('Content-Type', 'application/json')
  }

  return response.send(JSON.stringify(resultKeys))
}
