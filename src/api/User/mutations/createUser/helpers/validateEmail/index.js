// @flow
import validator from 'validator'
import database from '@server/database'

export const INVALID_ADDRESS_ERROR =
  'Your e-mail address does not seem to be valid.'
export const EMAIL_ALREADY_IN_USE_ERROR =
  'This e-mail address is already in use by another user.'

type EmailValidationResult = {
  isValid: boolean,
  errors: Array<string>
}

const validateEmail = async (email: string): Promise<EmailValidationResult> => {
  const errors: Array<string> = []
  const existingUsersWithEmail = await database('users')
    .where({ email })
    .count()

  if (!validator.isEmail(email)) {
    errors.push(INVALID_ADDRESS_ERROR)
  }

  if (existingUsersWithEmail[0].count > 0) {
    errors.push(EMAIL_ALREADY_IN_USE_ERROR)
  }

  return {
    isValid: !errors.length,
    errors
  }
}

export default validateEmail
