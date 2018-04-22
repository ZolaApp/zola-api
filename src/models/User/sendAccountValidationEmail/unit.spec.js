import { EMAIL_VALIDATION_TEMPLATE_ID } from '@constants/sendGridTemplatesIDs'
import sendGrid from '@sendgrid/mail'
import sendAccountValidationEmail from './index'

const user = {
  name: 'Foo',
  email: 'foo@bar.com'
}

describe('The User model’s `sendAccountValidationEmail` helper', () => {
  it('should send an e-mail using SendGrid with the expected parameters', () => {
    const send = jest.spyOn(sendGrid, 'send')
    sendAccountValidationEmail(user)

    expect(send).toHaveBeenCalledWith({
      to: user.email,
      from: 'noreply@zola.ink',
      templateId: EMAIL_VALIDATION_TEMPLATE_ID,
      substitutions: {
        name: user.name,
        validateEmailLink: 'https://zola.ink'
      }
    })
  })
})
