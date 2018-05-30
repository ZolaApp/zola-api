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

  console.log(request.params)
  console.log(localeCode)

  const project = await Project.query().findOne({
    cdnToken,
    ownerId: request.user.id
  })

  console.log('found project')

  if (!project) {
    response.status(404).send("This project wasn't found")

    return
  }

  const locale = await Locale.query().findOne({ code: localeCode })

  if (!locale) {
    response.status(404).send("This locale doesn't exist")

    return
  }

  console.log('found locale')

  console.log(locale.id)
  console.log(project.id)

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
    response.status(404).send('This locale is not activated for this project')

    return
  }

  const keysValues = await TranslationKey.query()
    .select('translationKeys.key', 'v.value')
    .join('translationValues as v', 'translationKeys.id', 'v.translationKeyId')
    .where('translationKeys.projectId', '=', project.id)
    .andWhere('v.localeId', '=', locale.id)

  const resultKeys = keysValues.reduce((acc, row) => {
    acc[row.key] = row.value

    return acc
  }, {})

  response.send(JSON.stringify(resultKeys))
}
