// @flow
import validator from 'validator'
import bcrypt from 'bcrypt'
import database from '@server/database'
import validateEmail from './validateEmail'
import validatePassword from './validatePassword'

type CreateUserArgs = {
  email: string,
  name: string,
  passwordPlain: string
}

const createUser = async (
  _: any,
  { email, name, passwordPlain }: CreateUserArgs
) => {
  const errors = []
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

  const passwordHash = await bcrypt.hash(passwordPlain, 10)
  const user = {
    email: validator.normalizeEmail(trimmedEmail),
    name: trimmedName,
    passwordHash
  }

  const savedUser = await database('users')
    .insert(user)
    .returning('*')

  return { user: savedUser[0], errors }
}

export default createUser
