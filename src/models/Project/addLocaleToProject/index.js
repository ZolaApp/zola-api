// @flow
import Project from '@models/Project'
import Locale from '@models/Locale'
import type { ValidationError } from '@types/ValidationError'
import prefillTranslationsValues from '@models/TranslationValue/prefillTranslationsValues'

export type AddLocaleToProjectArgs = {
  projectId: string,
  localeId: string,
  userId: string,
  shouldPrefillTranslations: boolean
}

type AddProjectToLocaleResponse = {
  errors: Array<ValidationError>
}

const addLocaleToProject = async ({
  projectId,
  localeId,
  userId,
  shouldPrefillTranslations
}: AddLocaleToProjectArgs): Promise<AddProjectToLocaleResponse> => {
  const errors: Array<ValidationError> = []
  const projectQuery = shouldPrefillTranslations
    ? Project.query().eager('translationKeys.translationValues')
    : Project.query()
  const project = await projectQuery.findOne({ id: projectId, ownerId: userId })
  const locale = await Locale.query().findById(localeId)

  if (!project || !locale) {
    const notFound = !project ? 'project' : 'locale'

    throw new Error(`This ${notFound} could not be found.`)
  }

  // Load locales in the correct order
  project.locales = await Locale.query()
    .join('projects_locales as pl', 'pl.localeId', 'locales.id')
    .join('projects as p', 'pl.projectId', 'p.id')
    .where('p.id', '=', project.id)
    .orderBy('pl.id', 'ASC')

  try {
    if (shouldPrefillTranslations) {
      await prefillTranslationsValues(project, locale)
    }

    project.locales.push(locale)
    await Project.query().upsertGraph(project, { relate: true })

    return { errors }
  } catch (error) {
    errors.push({ field: 'generic', message: error.message })

    return { errors }
  }
}

export default addLocaleToProject
