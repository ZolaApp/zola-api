// @flow
import bcrypt from 'bcrypt'
import type { ValidationError } from '@types/ValidationError'
import createToken from '@models/Token/createToken'
import retrieveToken from '@models/Token/retrieveToken'
import User from '@models/User'
import { AUTHENTICATION_ERROR_INVALID_CREDENTIALS } from '@constants/errors'

export type LoginUserArgs = {
  email: string,
  password: string
}

type LoginUserResponse = {
  token?: string,
  errors: Array<ValidationError>
}

const resolver = async (
  _: any,
  args: LoginUserArgs
): Promise<LoginUserResponse> => {
  const errors: Array<ValidationError> = []
  const email: string = args.email
  const password: string = args.password

  const user: User = await User.query().findOne({ email })

  const isPasswordMatching: Boolean = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!user || !isPasswordMatching) {
    errors.push({
      field: 'generic',
      message: AUTHENTICATION_ERROR_INVALID_CREDENTIALS
    })

    return { status: 'FAILURE', errors }
  }

  let token = await retrieveToken(user)

  if (token === null) {
    token = await createToken(user)
  }

  if (errors.length > 0) {
    return { status: 'FAILURE', errors }
  }

  return { status: 'SUCCESS', token: token.token, errors }
}

export default resolver
