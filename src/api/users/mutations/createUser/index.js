// @flow
import createUser from '@models/User/createUser'
import type { CreateUserArgs } from '@models/User/createUser'

const resolver = async (_: any, args: CreateUserArgs) => {
  const { errors, user } = await createUser(args)

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', user, errors }
}

export default resolver
