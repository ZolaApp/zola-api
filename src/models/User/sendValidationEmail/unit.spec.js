import { EMAIL_VALIDATION_TEMPLATE_ID } from '@constants/sendGridTemplatesIDs'
import sendGrid from '@sendgrid/mail'
import sendValidationEmail from './index'

const user = {
  name: 'Foo',
  email: 'foo@bar.com'
}

describe('The User model’s `sendValidationEmail` helper', () => {
  it('should send an e-mail with the expected configuration', () => {
    const send = jest.spyOn(sendGrid, 'send')
    sendValidationEmail(user)

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
