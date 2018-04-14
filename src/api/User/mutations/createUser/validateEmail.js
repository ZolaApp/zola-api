// @flow
import validator from 'validator'
import database from '@server/database'

type EmailValidationResult = {
  isValid: boolean,
  errors: Array<string>
}

const validateEmail = async (email: string): Promise<EmailValidationResult> => {
  const errors = []
  const existingUsersWithEmail = await database('users')
    .where({ email })
    .count()

  if (!validator.isEmail(email)) {
    errors.push('Your e-mail address does not seem to be valid.')
  }

  if (existingUsersWithEmail[0].count > 0) {
    errors.push('This e-mail address is already in use by another user.')
  }

  return {
    isValid: !errors.length,
    errors
  }
}

export default validateEmail
