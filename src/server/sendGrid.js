// @flow
import sendGrid from '@sendgrid/mail'

sendGrid.setApiKey(process.env.SENDGRID_API_KEY || '')
sendGrid.setSubstitutionWrappers('{{', '}}')

export default sendGrid
