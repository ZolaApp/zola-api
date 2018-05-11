// @flow
import bcrypt from 'bcrypt'
import database from '@database/index'
import TokenModel from '@models/Token'
import type { User } from '@models/User'

const INVALID_CREDENTIALS_ERROR = 'Invalid credentials.'

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
    return response.status(401).send(INVALID_CREDENTIALS_ERROR)
  }

  const user = userArray[0]
  const isPasswordMatching: Boolean = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!isPasswordMatching) {
    return response.status(401).send(INVALID_CREDENTIALS_ERROR)
  }

  let token = await TokenModel.retrieveToken(user)

  if (token === null) {
    token = await TokenModel.createToken(user)
  }

  return response.json({ token: token.token })
}

export default login
