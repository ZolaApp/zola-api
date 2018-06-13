// @flow
import Project from '@models/Project'
import Locale from '@models/Locale'

export default async (
  request: express$Request,
  response: express$Response,
  next: express$NextFunction
) => {
  const { cdnToken } = request.params
  const project = await Project.query().findOne({ cdnToken })
  const resultLocales = []

  if (!project) {
    return response.status(404).send('This project wasn’t found')
  }

  const locales = await Locale.query()
    .join('projects_locales as r', 'locales.id', 'r.localeId')
    .join('projects as p', 'r.projectId', 'p.id')
    .where('p.id', '=', project.id)

  if (!locales) {
    return response.send(JSON.stringify(resultLocales))
  }

  locales.forEach(locale => {
    resultLocales.push({ code: locale.code, name: locale.name })
  })

  return response.send(JSON.stringify(resultLocales))
}
