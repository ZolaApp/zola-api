// @flow
import bcrypt from 'bcrypt'
import { type ValidationError } from '@types/ValidationError'
import createToken from '@models/Token/createToken'
import retrieveToken from '@models/Token/retrieveToken'
import User from '@models/User'
import {
  AUTHENTICATION_ERROR_INVALID_CREDENTIALS,
  ERROR_MISSING_FIELD
} from '@constants/errors'

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
  { email, password }: LoginUserArgs
): Promise<LoginUserResponse> => {
  const errors: Array<ValidationError> = []

  if (!email || !password) {
    errors.push({
      field: !email ? 'email' : 'password',
      message: ERROR_MISSING_FIELD
    })

    return { status: 'FAILURE', errors }
  }

  const user: User = await User.query().findOne({ email })

  const isPasswordMatching: Boolean = await bcrypt.compare(
    password,
    user ? user.passwordHash : ''
  )

  if (!user || !isPasswordMatching) {
    errors.push({
      field: 'generic',
      message: AUTHENTICATION_ERROR_INVALID_CREDENTIALS
    })

    return { status: 'FAILURE', errors }
  }

  let token = await retrieveToken(user)

  try {
    if (token === null) {
      token = await createToken(user)
    }

    return { status: 'SUCCESS', token: token.token, errors }
  } catch (error) {
    errors.push({ field: 'generic', message: error.message })

    return { status: 'FAILURE', errors }
  }
}

export default resolver
