import { USER_VALIDATION_EMAIL_TEMPLATE_ID } from '@constants/sendGridTemplatesIDs'
import sendGrid from '@sendgrid/mail'
import sendValidationEmail from './index'

const user = {
  name: 'Foo',
  email: 'foo@bar.com'
}

describe('The User model’s `sendValidationEmail` helper', () => {
  it('should send an e-mail using SendGrid with the expected parameters', () => {
    const send = jest.spyOn(sendGrid, 'send')
    sendValidationEmail(user)

    expect(send).toHaveBeenCalledWith({
      to: user.email,
      from: 'noreply@zola.ink',
      templateId: USER_VALIDATION_EMAIL_TEMPLATE_ID,
      substitutions: {
        name: user.name,
        validationLink: 'https://zola.ink'
      }
    })
  })
})
