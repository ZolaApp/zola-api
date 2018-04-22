// @flow
import sendGrid from '@server/sendGrid'
import { EMAIL_VALIDATION_TEMPLATE_ID } from '@constants/sendGridTemplatesIDs'
import type { User } from '@models/User'

const sendAccountValidationEmail = (user: User): void => {
  const email = {
    to: user.email,
    from: 'noreply@zola.ink',
    templateId: EMAIL_VALIDATION_TEMPLATE_ID,
    substitutions: {
      name: user.name,
      validateEmailLink: 'https://zola.ink'
    }
  }

  sendGrid.send(email)
}

export default sendAccountValidationEmail
