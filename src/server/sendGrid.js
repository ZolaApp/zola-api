// @flow
import sendGrid from '@sendgrid/mail'

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('❌  `SENDGRID_API_KEY` environment key is missing.')
}

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)
sendGrid.setSubstitutionWrappers('{{', '}}')

export default sendGrid
