// @flow
import validator from 'validator'
import UserModel from '@models/User'
import type { User, CreateUserArgs } from '@models/User'
import type { ValidationError } from '@types/ValidationError'
import database from '@server/database'
import validateName from './helpers/validateName'
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
  const nameValidation = validateName(trimmedName)

  if (!nameValidation.isValid) {
    errors.push({ field: 'name', message: nameValidation.error })
  }

  const normalizedEmail = validator.normalizeEmail(email.trim())
  const existingUsersWithEmail = await database('users')
    .where({ email })
    .count()
  const isEmailInUse = existingUsersWithEmail[0].count > 0
  const emailValidation = validateEmail(normalizedEmail, isEmailInUse)

  if (!emailValidation.isValid) {
    emailValidation.errors.forEach(message => {
      errors.push({ field: 'email', message })
    })
  }

  const passwordValidation = validatePassword(passwordPlain, [
    normalizedEmail,
    trimmedName
  ])

  if (!passwordValidation.isValid) {
    errors.push({ field: 'password', message: passwordValidation.feedback })
  }

  if (errors.length > 0) {
    return { errors }
  }

  const createUserArgs = {
    email: normalizedEmail,
    name: trimmedName,
    passwordPlain
  }
  const user = await UserModel.createUser(createUserArgs)

  return { user }
}

export default createUser
