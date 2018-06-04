// @flow
import Project from '@models/Project'
import Locale from '@models/Locale'
import type { ValidationError } from '@types/ValidationError'

export type AddLocaleToProjectArgs = {
  projectId: string,
  localeId: string,
  userId: string
}

type AddProjectToLocaleResponse = {
  project?: Project,
  errors: Array<ValidationError>
}

const addLocaleToProject = async ({
  projectId,
  localeId,
  userId
}: AddLocaleToProjectArgs): Promise<AddProjectToLocaleResponse> => {
  const errors: Array<ValidationError> = []

  const project = await Project.query()
    .eager('locales')
    .findOne({ id: projectId, ownerId: userId })
  const locale = await Locale.query().findById(localeId)

  if (!project || !locale) {
    const notFound = !project ? 'project' : 'locale'

    throw new Error(`This ${notFound} could not be found.`)
  }

  project.locales.push(locale)

  try {
    await Project.query().upsertGraph(project, {
      relate: true
    })

    const updatedProject = await Project.query().findOne({
      id: projectId,
      ownerId: userId
    })

    updatedProject.locales = Locale.query()
      .join('projects_locales as pl', 'pl.localeId', 'locales.id')
      .join('projects as p', 'pl.projectId', 'p.id')
      .where('p.id', '=', updatedProject.id)
      .orderBy('pl.id', 'ASC')

    return { project: updatedProject, errors }
  } catch (error) {
    errors.push({ field: 'generic', message: error.message })

    return { errors }
  }
}

export default addLocaleToProject
