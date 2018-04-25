import { API_HREF } from '@constants/api'
import {
  NO_REPLY_EMAIL_ADDRESS,
  USER_VALIDATION_EMAIL_TEMPLATE_ID
} from '@constants/emails'
import sendGrid from '@sendgrid/mail'
import sendValidationEmail, { VALIDATE_PATH } from './index'

const user = {
  name: 'Foo',
  email: 'foo@bar.com'
}

describe('The User model’s `sendValidationEmail` helper', () => {
  it('should send an e-mail using SendGrid with the expected parameters', () => {
    const sendSpy = jest.spyOn(sendGrid, 'send')
    const emailValidationToken = 'DUMMY_VALIDATION_EMAIL_TOKEN'
    sendValidationEmail(user, emailValidationToken)

    expect(sendSpy).toHaveBeenCalledWith({
      to: user.email,
      from: NO_REPLY_EMAIL_ADDRESS,
      templateId: USER_VALIDATION_EMAIL_TEMPLATE_ID,
      substitutions: {
        name: user.name,
        validationLink: `${API_HREF + VALIDATE_PATH}/${emailValidationToken}`
      }
    })
  })
})
