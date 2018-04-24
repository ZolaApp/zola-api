// @flow
import sendGrid from '@server/sendGrid'
import { USER_VALIDATION_EMAIL_TEMPLATE_ID } from '@constants/sendGridTemplatesIDs'
import type { User } from '@models/User'

const sendValidationEmail = (user: User): void => {
  const email = {
    to: user.email,
    from: 'noreply@zola.ink',
    templateId: USER_VALIDATION_EMAIL_TEMPLATE_ID,
    substitutions: {
      name: user.name,
      validationLink: 'https://zola.ink'
    }
  }

  sendGrid.send(email)
}

export default sendValidationEmail
