// @flow
import UserModel from '@models/User'
import type { CreateUserArgs, CreateUserResponse } from '@models/User'

const resolver = async (
  _: any,
  args: CreateUserArgs
): Promise<CreateUserResponse> => {
  const { errors, user } = await UserModel.createUser(args)

  if (errors.length > 0) {
    return { errors }
  }

  return { user, errors }
}

export default resolver
