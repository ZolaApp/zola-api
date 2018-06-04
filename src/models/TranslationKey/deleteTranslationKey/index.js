// @flow
import TranslationKey from '@models/TranslationKey'

export type DeleteTranslationKeyArgs = {
  translationKeyId: string,
  ownerId: string
}

const deleteTranslationKey = async ({
  translationKeyId,
  ownerId
}: DeleteTranslationKeyArgs): Promise<void> => {
  const translationKey: TranslationKey = await TranslationKey.query()
    .eager('project')
    .findById(translationKeyId)

  if (
    !translationKey ||
    (translationKey.project && !translationKey.project.hasOwnerId(ownerId))
  ) {
    throw new Error('This translation key was not found.')
  }

  await TranslationKey.query().deleteById(translationKeyId)
}

export default deleteTranslationKey
