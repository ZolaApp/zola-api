// @flow
import bcrypt from 'bcrypt'
import validator from 'validator'
import User from '@models/User'
import type { ValidationError } from '@types/ValidationError'
import validateString from '@helpers/validateString'
import validateEmail from './validations/validateEmail'
import validatePassword from './validations/validatePassword'

const validateName = validateString({ type: 'name' })

export type CreateUserArgs = {
  email: string,
  name: string,
  passwordPlain: string
}

type CreateUserResponse = {
  user?: User,
  errors: Array<ValidationError>
}

const createUser = async ({
  email,
  name,
  passwordPlain
}: CreateUserArgs): Promise<CreateUserResponse> => {
  const errors: Array<ValidationError> = []
  const trimmedName = name.trim()
  const nameValidation = validateName(trimmedName)

  if (!nameValidation.isValid) {
    errors.push({ field: 'name', message: nameValidation.error })
  }

  const normalizedEmail = validator.normalizeEmail(email.trim(), {
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false
  })

  const existingUsersWithEmail = await User.query()
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

  const passwordHash: string = await bcrypt.hash(passwordPlain, 10)
  const user = User.query().insertAndFetch({
    email: normalizedEmail,
    name: trimmedName,
    passwordHash
  })

  return { user, errors: [] }
}

export default createUser
