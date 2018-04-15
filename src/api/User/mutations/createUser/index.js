// @flow
import validator from 'validator'
import UserModel from '@models/User'
import type { User, CreateUserArgs } from '@models/User'
import type { ValidationError } from '@types/ValidationError'
import validateEmail from './helpers/validateEmail'
import validatePassword from './helpers/validatePassword'

type CreateUserResponse = {
  user?: User,
  errors?: Array<ValidationError>
}

const createUser = async (
  _: any,
  { email, name, passwordPlain }: CreateUserArgs
): Promise<CreateUserResponse> => {
  const errors: Array<ValidationError> = []
  const trimmedName = name.trim()

  if (!validator.isLength(trimmedName, { min: 2, max: 30 })) {
    errors.push({
      field: 'name',
      message:
        'Your name is too long. It should be between 2 and 30 characters.'
    })
  }

  const trimmedEmail = email.trim()
  const emailValidation = await validateEmail(trimmedEmail)

  if (!emailValidation.isValid) {
    emailValidation.errors.forEach(message => {
      errors.push({ field: 'email', message })
    })
  }

  const passwordValidation = validatePassword(passwordPlain, [
    trimmedEmail,
    trimmedName
  ])

  if (!passwordValidation.isValid) {
    errors.push({ field: 'password', message: passwordValidation.feedback })
  }

  if (errors.length > 0) {
    return { errors }
  }

  const createUserArgs = {
    email: validator.normalizeEmail(trimmedEmail),
    name: trimmedName,
    passwordPlain
  }
  const user = await UserModel.createUser(createUserArgs)

  return { user }
}

export default createUser
