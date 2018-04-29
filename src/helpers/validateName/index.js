// @flow
const MIN_LENGTH = 2
const MAX_LENGTH = 30

type NameValidationArgs = {
  name: string,
  minLength?: number,
  maxLength?: number
}

type NameValidationResult = {
  isValid: boolean,
  error: string
}

const validateName = ({
  name,
  minLength = MIN_LENGTH,
  maxLength = MAX_LENGTH
}: NameValidationArgs): NameValidationResult => {
  const isValid = name.length >= minLength && name.length <= maxLength
  const issue = name.length < minLength ? 'short' : 'long'
  const error = isValid
    ? ''
    : `Your name is too ${issue}. It should be between ${minLength} and ${maxLength} characters.`

  return { isValid, error }
}

export default validateName
