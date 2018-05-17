// @flow
import Project from '@models/Project'
import Locale from '@models/Locale'
import type { ValidationError } from '@types/ValidationError'

export type AddLocaleToProjectArgs = {
  projectId: string,
  localeId: string
}

type AddProjectToLocaleResponse = {
  project?: Project,
  errors: Array<ValidationError>
}

const createProject = async ({
  projectId,
  localeId
}: AddLocaleToProjectArgs): Promise<AddProjectToLocaleResponse> => {
  const errors: Array<ValidationError> = []

  const project = await Project.query().findById(projectId)
  const locale = await Locale.query().findById(localeId)

  if (!project || !locale) {
    const notFound = !project ? 'locale' : 'project'
    errors.push({
      field: notFound,
      message: `This ${notFound} could not be found.`
    })

    return { errors }
  }

  project.locales.push(locale)

  try {
    const returnProject = await Project.query().upsertGraphAndFetch(project)

    return { returnProject, errors }
  } catch (error) {
    errors.push({ field: 'generic', message: error.message })

    return { errors }
  }
}

export default createProject
