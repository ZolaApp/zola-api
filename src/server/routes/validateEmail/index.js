// @flow
import { APP_HREF } from '@constants/api'
import database from '@server/database'
import redis from '@server/redis'

const validateEmail = async (
  request: express$Request,
  response: express$Response
) => {
  const emailValidationToken = request.params.emailValidationToken
  const redisKey = `user:emailValidationToken:${emailValidationToken}`
  const tokenOwner = await redis.get(redisKey)

  // If this validation token is not valid, redirect the user to the validate
  // email page so that they can generate another one.
  if (tokenOwner === null) {
    return response.redirect(`${APP_HREF}/validate-email`)
  }

  await Promise.all([
    redis.del(redisKey),
    database('users')
      .where({ id: tokenOwner })
      .update({ isValidated: true })
  ])

  return response.redirect(`${APP_HREF}/email-validated`)
}

export default validateEmail
