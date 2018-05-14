// @flow
import bcrypt from 'bcrypt'
import createToken from '@models/Token/createToken'
import retrieveToken from '@models/Token/retrieveToken'
import User from '@models/User'

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

  const user: User = await User.query().findOne({ email })

  if (user === null) {
    return response.status(401).send(INVALID_CREDENTIALS_ERROR)
  }

  const isPasswordMatching: Boolean = await bcrypt.compare(
    password,
    user.passwordHash
  )

  if (!isPasswordMatching) {
    return response.status(401).send(INVALID_CREDENTIALS_ERROR)
  }

  let token = await retrieveToken(user)

  if (token === null) {
    token = await createToken(user)
  }

  return response.json({ token: token.token })
}

export default login
