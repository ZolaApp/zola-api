// @flow
import zxcvbn from 'zxcvbn'

type PasswordValidation = {
  score: number,
  feedback: {
    warning: string,
    suggestions: Array<string>
  }
}

type PasswordValidationResult = {
  isValid: boolean,
  feedback: string
}

const validatePassword = (
  passwordPlain: string,
  userInputs: Array<string>
): PasswordValidationResult => {
  const passwordValidation: PasswordValidation = zxcvbn(passwordPlain)
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

export default validatePassword
