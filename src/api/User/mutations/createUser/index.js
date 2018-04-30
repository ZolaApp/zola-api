// @flow
import UserModel from '@models/User'
import type { CreateUserArgs } from '@models/User'

const resolver = async (_: any, args: CreateUserArgs) => {
  const { errors, user } = await UserModel.createUser(args)

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', user, errors }
}

export default resolver
