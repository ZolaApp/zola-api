// @flow
import TranslationValue from '@models/TranslationValue'
import TranslationKey from '@models/TranslationKey'
import Locale from '@models/Locale'
import validateString from '@helpers/validateString'
import type { ValidationError } from '@types/ValidationError'
import { DUPLICATE_ENTRY_ERROR_TYPE } from '@constants/errors'

const validateValue = validateString({
  type: 'translation value',
  minLength: 1,
  maxLength: Infinity
})

export type AddTranslationValueToTranslationKeyArgs = {
  value: string,
  translationKeyId: string,
  localeId: string,
  ownerId: string
}

type AddTranslationValueToTranslationKeyResponse = {
  translationKey?: TranslationKey,
  errors: Array<ValidationError>
}

const addTranslationValueToTranslationKey = async ({
  value,
  translationKeyId,
  localeId,
  ownerId
}: AddTranslationValueToTranslationKeyArgs): Promise<
  AddTranslationValueToTranslationKeyResponse
> => {
  const errors: Array<ValidationError> = []

  const translationKey: TranslationKey = await TranslationKey.query()
    .findById(translationKeyId)
    .eager('[project.locales, translationValues.locale]')

  if (!translationKey) {
    throw new Error('This translation key was not found.')
  }

  const project = translationKey.project
  const locale = await Locale.query().findById(localeId)

  if (project && !project.hasOwnerId(ownerId)) {
    throw new Error('This project was not found.')
  }

  if (!locale) {
    throw new Error('This locale doesn’t exist.')
  }

  const isLocaleActivated = await Locale.query()
    .join('projects_locales as r', 'locales.id', 'r.localeId')
    .join('projects as p', 'r.projectId', 'p.id')
    .where('locales.id', '=', localeId)
    .andWhere('p.id', '=', project.id)
    .count()
    .pluck('count')
    .first()

  if (isLocaleActivated === '0') {
    throw new Error('This locale is not activated for this project')
  }

  const valueValidation = validateValue(value)

  if (!valueValidation.isValid) {
    errors.push({
      field: 'value',
      message: valueValidation.error
    })

    return { errors }
  }

  // Saving key
  try {
    const translationValue = new TranslationValue(value, locale)
    translationKey.translationValues.push(translationValue)

    const updatedTranslationKey = await TranslationKey.query()
      .upsertGraphAndFetch(translationKey, { relate: true })
      .eager('translationValues.locale')

    return { translationKey: updatedTranslationKey, errors }
  } catch (err) {
    const message =
      err.routine === DUPLICATE_ENTRY_ERROR_TYPE
        ? `A value already exists for the key "${
            translationKey.key
          }" and locale ${locale.name}`
        : `Something went wrong while adding this value to the key`

    throw new Error(message)
  }
}

export default addTranslationValueToTranslationKey
