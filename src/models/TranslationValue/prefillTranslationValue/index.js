// @flow
import { type ValidationError } from '@types/ValidationError'
import Locale from '@models/Locale'
import autoTranslate from '@helpers/autoTranslate'
import addTranslationValueToTranslationKey from '@models/TranslationValue/addTranslationValueToTranslationKey'

export type PrefillTranslationValueArgs = {
  value: string,
  translationKeyId: string,
  localeId: string,
  ownerId: string
}

type PrefillTranslationValueResponse = {
  errors: Array<ValidationError>
}

const prefillTranslationValue = async ({
  value,
  translationKeyId,
  localeId,
  ownerId
}: PrefillTranslationValueArgs): Promise<PrefillTranslationValueResponse> => {
  try {
    const locale = await Locale.query().findById(localeId)
    const translation = await autoTranslate(value, locale.code)
    const { errors } = await addTranslationValueToTranslationKey({
      value: translation,
      translationKeyId,
      localeId,
      ownerId
    })

    return { errors }
  } catch (error) {
    return { errors: [{ field: 'generic', message: error.message }] }
  }
}

export default prefillTranslationValue
