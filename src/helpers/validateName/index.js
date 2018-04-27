// @flow
const MIN_LENGTH = 2
const MAX_LENGTH = 30

type NameValidationResult = {
  isValid: boolean,
  error: string
}

const validateName = (
  name: string,
  minLength: number = MIN_LENGTH,
  maxLength: number = MAX_LENGTH
): NameValidationResult => {
  const isValid = name.length >= minLength && name.length <= maxLength
  const issue = name.length < minLength ? 'short' : 'long'
  const error = isValid
    ? ''
    : `Your name is too ${issue}. It should be between 2 and 30 characters.`

  return { isValid, error }
}

export default validateName
