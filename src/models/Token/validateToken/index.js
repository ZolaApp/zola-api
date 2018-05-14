// @flow
import Token from '@models/Token'

const validateToken = async (token: string): Promise<Token | null> => {
  const retrievedToken = await Token.query().findOne({ token })

  return retrievedToken || null
}

export default validateToken
