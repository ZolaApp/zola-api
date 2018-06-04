// @flow
import TranslationKey from '@models/TranslationKey'
import type { ValidationError } from '@types/ValidationError'
import validateString from '@helpers/validateString'
import Project from '@models/Project'
import { DUPLICATE_ENTRY_ERROR_TYPE } from '@constants/errors'

const validateKey = validateString({
  type: 'translation key',
  minLength: 1,
  maxLength: 255
})

export type AddTranslationKeyToProjectArgs = {
  key: string,
  projectId: string,
  ownerId: string
}

type AddTranslationKeyToProjectResponse = {
  errors: Array<ValidationError>
}

const addTranslationKeyToProject = async ({
  key,
  projectId,
  ownerId
}: AddTranslationKeyToProjectArgs): Promise<
  AddTranslationKeyToProjectResponse
> => {
  const errors: Array<ValidationError> = []
  const keyValidation = validateKey(key)

  if (!keyValidation.isValid) {
    errors.push({ field: 'key', message: keyValidation.error })

    return { errors }
  }

  //  First some authorization stuff
  const project: Project = await Project.query().findById(projectId)

  if (project && !project.hasOwnerId(ownerId)) {
    throw new Error('This project was not found')
  }

  // Saving key
  try {
    const translationKey = new TranslationKey(key)
    translationKey.project = project

    await TranslationKey.query().insertGraph(translationKey, { relate: true })

    return { errors }
  } catch (err) {
    const message =
      err.routine === DUPLICATE_ENTRY_ERROR_TYPE
        ? `A key with value "${key}" already exists for this project`
        : `Something went wrong while adding this key to the project`

    throw new Error(message)
  }
}

export default addTranslationKeyToProject
