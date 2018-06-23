// @flow
import addTranslationKeysToProject, {
  type AddTranslationKeysToProjectArgs
} from '@models/TranslationKey/addTranslationKeysToProject'
import { AUTHENTICATION_ERROR_NO_USER } from '@constants/errors'

type Context = {
  request: express$Request
}

const resolver = async (
  _: any,
  args: AddTranslationKeysToProjectArgs,
  { request }: Context
) => {
  if (request.user === null) {
    throw new Error(AUTHENTICATION_ERROR_NO_USER)
  }

  const { errors } = await addTranslationKeysToProject({
    ...args,
    ownerId: request.user.id
  })

  // In this particular case, we want to return FAILURE only if none of the given keys were saved.
  // We could be a bit more precise and check the field of the error but ¯\_(ツ)_/¯
  if (errors.length === args.keys.length) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', errors }
}

export default resolver
