// @flow
import createProjectUser from './createProjectUser'
export * from './createProjectUser'

export type ProjectUser = {
  id: string,
  projectId: string,
  userId: string,
  role: string
}

export default {
  createProjectUser
}
