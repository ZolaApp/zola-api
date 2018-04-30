// // @flow
const MIN_LENGTH = 2
const MAX_LENGTH = 30

type StringValidationOptions = {
  type: string,
  minLength?: number,
  maxLength?: number
}

type StringValidationResult = {
  isValid: boolean,
  error: string
}

const validateString = ({
  type,
  minLength = MIN_LENGTH,
  maxLength = MAX_LENGTH
}: StringValidationOptions) => (string: string): StringValidationResult => {
  const isValid = string.length >= minLength && string.length <= maxLength
  const issue = string.length < minLength ? 'short' : 'long'
  const error = isValid
    ? ''
    : `Your ${type} is too ${issue}. It should be between ${minLength} and ${maxLength} characters.`

  return { isValid, error }
}

export default validateString
