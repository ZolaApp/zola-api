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

export type AddTranslationKeysToProjectArgs = {
  keys: Array<string>,
  projectId: string,
  ownerId: string
}

type AddTranslationKeysToProjectResponse = {
  errors: Array<ValidationError>
}

const addTranslationKeysToProject = async ({
  keys,
  projectId,
  ownerId
}: AddTranslationKeysToProjectArgs): Promise<
  AddTranslationKeysToProjectResponse
> => {
  const errors: Array<ValidationError> = []

  const keysToAdd: Array<string> = []

  //  First some authorization stuff
  const project: Project = await Project.query().findById(projectId)

  if (project && !project.hasOwnerId(ownerId)) {
    throw new Error('This project was not found')
  }

  keys.forEach(key => {
    const keyValidation = validateKey(key)

    if (!keyValidation.isValid) {
      errors.push({ field: 'key', message: keyValidation.error })
    } else {
      keysToAdd.push(key)
    }
  })

  // Saving keys
  await Promise.all(
    keysToAdd.map(async key => {
      try {
        const translationKey = new TranslationKey(key)
        translationKey.project = project
        await TranslationKey.query().insertGraph(translationKey, {
          relate: true
        })
      } catch (error) {
        if (error.routine === DUPLICATE_ENTRY_ERROR_TYPE) {
          errors.push({
            field: 'key',
            message: `A key with value "${key}" already exists for this project`
          })
        } else {
          errors.push({
            field: 'generic',
            message: error.message
          })
        }
      }
    })
  )

  return { errors }
}

export default addTranslationKeysToProject
