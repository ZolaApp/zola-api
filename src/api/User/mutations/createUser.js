// @flow
import validator from 'validator'
import zxcvbn from 'zxcvbn'
import bcrypt from 'bcrypt'

type PasswordValidationResult = {
  isValid: boolean,
  feedback: string
}

const validatePassword = (
  passwordPlain: string,
  userInputs: Array<string>
): PasswordValidationResult => {
  const passwordValidation = zxcvbn(passwordPlain)
  const { warning, suggestions } = passwordValidation.feedback
  const formattedSuggestions = suggestions.join(' ')
  const feedback =
    (warning ? `${warning}. ${formattedSuggestions}` : formattedSuggestions) ||
    'Your password is not secure enough.'

  return {
    isValid: passwordValidation.score > 3,
    feedback
  }
}

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
