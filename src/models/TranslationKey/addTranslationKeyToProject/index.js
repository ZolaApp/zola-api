// @flow
import TranslationKey from '@models/TranslationKey'
import type { ValidationError } from '@types/ValidationError'
import validateString from '@helpers/validateString'
import Project from '@models/Project'
import { DUPLICATE_ENTRY_ERROR_TYPE } from '@constants/errors'

const validateKey = validateString({
  type: 'translation key',
  minLength: 1,
  maxLength: 55
})

export type AddTranslationKeyToProjectArgs = {
  key: string,
  projectId: string,
  ownerId: string
}

type AddTranslationKeyToProjectResponse = {
  project?: Project,
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
  const project: Project = await Project.query()
    .findById(projectId)
    .eager('translationKeys')

  if (!project || (project && !project.hasOwnerId(ownerId))) {
    throw new Error('This project was not found')
  }

  // Saving key
  try {
    const translationKey = new TranslationKey(key)
    project.translationKeys.push(translationKey)

    const updatedProject = await Project.query().upsertGraph(project)

    return { project: updatedProject, errors }
  } catch (err) {
    const message =
      err.routine === DUPLICATE_ENTRY_ERROR_TYPE
        ? `A key with value "${key}" already exists for this project`
        : `Something went wrong while adding this key to the project`

    throw new Error(message)
  }
}

export default addTranslationKeyToProject
