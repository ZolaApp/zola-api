// @flow
import { type ValidationError } from '@types/ValidationError'
import TranslationKey from '@models/TranslationKey'

export type DeleteTranslationKeyArgs = {
  translationKeyId: string,
  ownerId: string
}

type DeleteTranslationKeyResponse = {
  errors: Array<ValidationError>
}

const deleteTranslationKey = async ({
  translationKeyId,
  ownerId
}: DeleteTranslationKeyArgs): Promise<DeleteTranslationKeyResponse> => {
  const translationKey: TranslationKey = await TranslationKey.query()
    .eager('project')
    .findById(translationKeyId)

  if (
    !translationKey ||
    (translationKey.project && !translationKey.project.hasOwnerId(ownerId))
  ) {
    throw new Error('This translation key was not found.')
  }

  try {
    await TranslationKey.query().deleteById(translationKeyId)

    return { errors: [] }
  } catch (error) {
    return { errors: [{ field: 'generic', message: error.message }] }
  }
}

export default deleteTranslationKey
