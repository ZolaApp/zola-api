// @flow
import zxcvbn from 'zxcvbn'

const MINIMUM_SCORE = 3

type PasswordValidationFeedback = {
  warning: string,
  suggestions: Array<string>
}

type PasswordValidation = {
  score: number,
  feedback: PasswordValidationFeedback
}

type PasswordValidationResult = {
  isValid: boolean,
  feedback: string
}

const getFeedback = ({
  warning,
  suggestions
}: PasswordValidationFeedback): string => {
  // Zxcvbn returns two fields in their feedback: a `warning`, and `suggestions`
  // which are an array of suggestions. Both `warning` and `suggestions` can
  // potentially be empty. We join all of those to return a long but complete
  // feedback message to the user.
  const formattedSuggestions = suggestions.join(' ')
  const feedback = warning
    ? `${warning}. ${formattedSuggestions}`
    : formattedSuggestions || 'Your password is not secure enough.'

  return feedback
}

const validatePassword = (
  passwordPlain: string,
  userInputs: Array<string>
): PasswordValidationResult => {
  const passwordValidation: PasswordValidation = zxcvbn(passwordPlain)
  const isValid = passwordValidation.score >= MINIMUM_SCORE
  const feedback = getFeedback(passwordValidation.feedback)

  return {
    isValid,
    feedback: isValid ? '' : feedback
  }
}

export default validatePassword
