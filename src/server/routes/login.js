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
  const isPasswordMatching: Boolean = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!isPasswordMatching) {
    return response.status(401).send('Invalid credentials')
  }

  let token = await TokenModel.retrieveToken(user)

  if (token === null) {
    const tokenResponse = await TokenModel.createToken(user)

    if (tokenResponse.token === null) {
      return response.status(500).send('An error occurred.')
    }

    token = tokenResponse.token
  }

  return response.json({ token })
}

export default login
