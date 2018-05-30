// @flow
import TranslationValue from '@models/TranslationValue'
import TranslationKey from '@models/TranslationKey'
import Locale from '@models/Locale'
import validateString from '@helpers/validateString'
import type { ValidationError } from '@types/ValidationError'

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
    .eager('project')
    .findById(translationKeyId)

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

  const isLocaleActivated =
    (await Locale.query()
      .join('projects_locales as r', 'locales.id', 'r.localeId')
      .join('projects as p', 'r.projectId', 'p.id')
      .where('locales.id', '=', localeId)
      .andWhere('p.id', '=', project.id)
      .count()
      .pluck('count')
      .first()) !== '0'

  if (!isLocaleActivated) {
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
    const translationValue =
      (await TranslationValue.query().findOne({
        translationKeyId: translationKey.id,
        localeId: locale.id
      })) || new TranslationValue(value, locale)

    translationValue.value = value

    translationKey.translationValues = [translationValue]

    const updatedTranslationKey = await TranslationKey.query()
      .upsertGraphAndFetch(translationKey, { relate: true, noDelete: true })
      .eager('translationValues.locale')

    return { translationKey: updatedTranslationKey, errors }
  } catch (err) {
    throw new Error(`Something went wrong while adding this value to the key`)
  }
}

export default addTranslationValueToTranslationKey
