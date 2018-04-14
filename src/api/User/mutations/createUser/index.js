// @flow
import validator from 'validator'
import bcrypt from 'bcrypt'
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
  const trimmedEmail = email.trim()
  const trimmedName = name.trim()

  if (!validator.isEmail(trimmedEmail)) {
    errors.push({
      field: 'email',
      message: 'Your e-mail address does not seem to be valid.'
    })
  }

  if (!validator.isLength(trimmedName, { min: 2, max: 30 })) {
    errors.push({
      field: 'name',
      message:
        'Your name is too long. It should be between 2 and 30 characters.'
    })
  }

  const passwordValidation = validatePassword(passwordPlain, [
    trimmedEmail,
    trimmedName
  ])

  if (!passwordValidation.isValid) {
    errors.push({ field: 'password', message: passwordValidation.feedback })
  }

  if (errors.length) {
    return { errors }
  }

  const passwordHash = await bcrypt.hash(passwordPlain, 10)
  const user = {
    email: validator.normalizeEmail(trimmedEmail),
    name: trimmedName,
    passwordHash
  }

  return { user, errors }
}

export default createUser
