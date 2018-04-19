// @flow
type NameValidationResult = {
  isValid: boolean,
  error: string
}

const validateName = (name: string): NameValidationResult => {
  const isValid = name.length >= 2 && name.length <= 30
  const issue = name.length < 2 ? 'short' : 'long'
  const error = isValid
    ? ''
    : `Your name is too ${issue}. It should be between 2 and 30 characters.`

  return { isValid, error }
}

export default validateName
