// @flow
import TranslationValue from '@models/TranslationValue'
import TranslationKey from '@models/TranslationKey'
import Locale from '@models/Locale'
import type { ValidationError } from '@types/ValidationError'

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

  if ((project && project.ownerId !== ownerId) || !locale) {
    throw new Error('This project was not found.')
  }

  let isLocaleActivated = false
  project.locales.forEach(projectLocale => {
    if (projectLocale.id === locale.id) {
      isLocaleActivated = true
    }
  })

  if (!isLocaleActivated) {
    throw new Error('This locale is not activated for this project')
  }

  if (value.length < 1) {
    errors.push({
      field: 'value',
      message: 'Your value should be at least 1 character'
    })

    return { errors }
  }

  // Saving key
  try {
    const translationValue = new TranslationValue(value, locale)
    translationKey.translationValues.push(translationValue)

    console.log('========================> DEBUG')
    console.log(translationKey)
    console.log('========================> END')

    const updatedTranslationKey = await TranslationKey.query()
      .upsertGraphAndFetch(translationKey, { relate: true })
      .eager('translationValues.locale')

    return { translationKey: updatedTranslationKey, errors }
  } catch (err) {
    const message =
      err.routine === '_bt_check_unique'
        ? `A value already exists for the key "${
            translationKey.key
          }" and locale ${locale.name}`
        : `Something went wrong while adding this value to the key`

    throw new Error(message)
  }
}

export default addTranslationValueToTranslationKey
