// @flow
import { API_HREF } from '@constants/api'
import {
  NO_REPLY_EMAIL_ADDRESS,
  USER_VALIDATION_EMAIL_TEMPLATE_ID
} from '@constants/emails'
import sendGrid from '@server/sendGrid'
import type { User } from '@models/User'

export const VALIDATE_PATH = '/validate-email'

const sendValidationEmail = (
  user: User,
  emailValidationToken: string
): void => {
  const email = {
    to: user.email,
    from: NO_REPLY_EMAIL_ADDRESS,
    templateId: USER_VALIDATION_EMAIL_TEMPLATE_ID,
    substitutions: {
      name: user.name,
      validationLink: `${API_HREF + VALIDATE_PATH}/${emailValidationToken}`
    }
  }

  sendGrid.send(email)
}

export default sendValidationEmail
