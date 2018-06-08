// @flow
import prefillTranslationValue, {
  type PrefillTranslationValueArgs
} from '@models/TranslationValue/prefillTranslationValue'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

const resolver = async (
  _: any,
  args: PrefillTranslationValueArgs,
  { request }: Context
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const { errors } = await prefillTranslationValue({
    ...args,
    ownerId: request.user.id
  })

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', errors }
}

export default resolver
