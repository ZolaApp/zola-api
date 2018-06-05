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
  const relations = [
    'locales',
    shouldPrefillTranslations && 'translationKeys.translationValues'
  ]
    .filter(Boolean)
    .join(', ')

  const project = await Project.query()
    .eager(`[${relations}]`)
    .findOne({ id: projectId, ownerId: userId })
  const locale = await Locale.query().findById(localeId)

  if (!project || !locale) {
    const notFound = !project ? 'project' : 'locale'

    throw new Error(`This ${notFound} could not be found.`)
  }

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
