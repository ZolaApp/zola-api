// @flow
import deleteTranslationKey, {
  type DeleteTranslationKeyArgs
} from '@models/TranslationKey/deleteTranslationKey'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

const resolver = async (
  _: any,
  args: DeleteTranslationKeyArgs,
  { request }: Context
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  await deleteTranslationKey({
    ...args,
    ownerId: request.user.id
  })

  return { status: 'SUCCESS' }
}

export default resolver
