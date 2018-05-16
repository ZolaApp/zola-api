// @flow
import bcrypt from 'bcrypt'
import validator from 'validator'
import User from '@models/User'
import type { ValidationError } from '@types/ValidationError'
import validateString from '@helpers/validateString'
import validateEmail from './validations/validateEmail'
import validatePassword from './validations/validatePassword'

const validateFirstName = validateString({ type: 'firstName' })
const validateLastName = validateString({ type: 'lastName' })
const validateJob = validateString({ type: 'job', maxLength: 50 })

export type CreateUserArgs = {
  email: string,
  firstName: string,
  lastName: string,
  job: string,
  passwordPlain: string
}

type CreateUserResponse = {
  user?: User,
  errors: Array<ValidationError>
}

const createUser = async ({
  firstName,
  lastName,
  email,
  job,
  passwordPlain
}: CreateUserArgs): Promise<CreateUserResponse> => {
  const errors: Array<ValidationError> = []
  const trimmedFirstName = firstName.trim()
  const firstNameValidation = validateFirstName(trimmedFirstName)

  if (!firstNameValidation.isValid) {
    errors.push({ field: 'name', message: firstNameValidation.error })
  }

  const trimmedLastName = lastName.trim()
  const lastNameValidation = validateLastName(trimmedLastName)

  if (!lastNameValidation.isValid) {
    errors.push({ field: 'name', message: lastNameValidation.error })
  }

  const trimmedJob = job.trim()
  const jobValidation = validateJob(trimmedJob)

  if (!jobValidation.isValid) {
    errors.push({ field: 'job', message: jobValidation.error })
  }

  const normalizedEmail = validator.normalizeEmail(email.trim(), {
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false
  })

  const existingUsersWithEmail = await User.query()
    .where({ email })
    .count()
    .first()
  const isEmailInUse = existingUsersWithEmail.count > 0
  const emailValidation = validateEmail(normalizedEmail, isEmailInUse)

  if (!emailValidation.isValid) {
    emailValidation.errors.forEach(message => {
      errors.push({ field: 'email', message })
    })
  }

  const passwordValidation = validatePassword(passwordPlain, [
    normalizedEmail,
    trimmedFirstName,
    trimmedLastName
  ])

  if (!passwordValidation.isValid) {
    errors.push({ field: 'password', message: passwordValidation.feedback })
  }

  if (errors.length > 0) {
    return { errors }
  }

  // Saving user
  const passwordHash: string = await bcrypt.hash(passwordPlain, 10)
  const user = await User.query().insertAndFetch({
    firstName: trimmedFirstName,
    lastName: trimmedLastName,
    email: normalizedEmail,
    job: trimmedJob,
    passwordHash
  })

  return { user, errors: [] }
}

export default createUser
