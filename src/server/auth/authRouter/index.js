// @flow

import bcrypt from 'bcrypt'
import database from '@server/database'
import TokenModel from '@models/Token'
import type { User } from '@models/User'

const login = async (
  request: express$Request,
  response: express$Response,
  next: express$NextFunction
) => {
  const email: string = request.body.email
  const password: string = request.body.password

  if (!email || !password) {
    return response.send('No params')
  }

  const userArray: Array<User> = await database('users').where({ email })

  if (!userArray.length) {
    return response.status(401).send('Invalid credentials')
  }

  const user = userArray[0]

  const passwordMatch: Boolean = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!passwordMatch) {
    return response.status(401).send('Invalid credentials')
  }

  let token = await TokenModel.retrieveToken(user)

  if (token == null) {
    const tokenResponse = await TokenModel.createToken(user)

    if (tokenResponse.token !== null) {
      token = tokenResponse.token
    } else {
      // @TODO : handle errors returned in tokenResponse
      return response.status(500).send('An error occurred.')
    }
  }

  response.setHeader('Content-Type', 'application/json')
  response.send(JSON.stringify(token.token))
}

const revokeToken = async (
  request: express$Request,
  response: express$Response,
  next: express$NextFunction
) => {}

export default {
  login,
  revokeToken
}
