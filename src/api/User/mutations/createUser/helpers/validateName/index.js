// @flow
import validator from 'validator'

type NameValidationResult = {
  isValid: boolean,
  error: string
}

const validateName = (name: string): NameValidationResult => {
  const isValid = validator.isLength(name, { min: 2, max: 30 })

  if (isValid) {
    return {
      isValid,
      error: ''
    }
  }

  const issue = name.length < 2 ? 'short' : 'long'
  const error = `Your name is too ${issue}. It should be between 2 and 30 characters.`

  return {
    isValid: false,
    error
  }
}

export default validateName
