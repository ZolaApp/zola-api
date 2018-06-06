// @flow
import addTranslationValueToTranslationKey, {
  type AddTranslationValueToTranslationKeyArgs
} from '@models/TranslationValue/addTranslationValueToTranslationKey'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

const resolver = async (
  _: any,
  args: AddTranslationValueToTranslationKeyArgs,
  { request }: Context
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const { errors } = await addTranslationValueToTranslationKey({
    ...args,
    ownerId: request.user.id
  })

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', errors }
}

export default resolver
