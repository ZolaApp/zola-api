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
    const updatedProject = await Project.query().upsertGraphAndFetch(project, {
      relate: true
    })

    return { project: updatedProject, errors }
  } catch (error) {
    errors.push({ field: 'generic', message: error.message })

    return { errors }
  }
}

export default addLocaleToProject