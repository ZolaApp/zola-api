// @flow
import { getUsers } from '@models/User'

export default async (request: express$Request, response: express$Response) => {
  const users = await getUsers()

  return response.send('Users count: ' + users.length)
}
