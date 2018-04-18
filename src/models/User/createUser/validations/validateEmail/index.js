// @flow
import validator from 'validator'

export const INVALID_EMAIL_ERROR =
  'Your e-mail address does not seem to be valid.'
export const EMAIL_ALREADY_IN_USE_ERROR =
  'This e-mail address is already in use by another user.'

type EmailValidationResult = {
  isValid: boolean,
  errors: Array<string>
}

const validateEmail = (
  email: string,
  isEmailInUse: boolean
): EmailValidationResult => {
  const errors: Array<string> = []

  if (!validator.isEmail(email)) {
    errors.push(INVALID_EMAIL_ERROR)
  }

  if (isEmailInUse) {
    errors.push(EMAIL_ALREADY_IN_USE_ERROR)
  }

  return {
    isValid: !errors.length,
    errors
  }
}

export default validateEmail
