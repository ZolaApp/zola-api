// @flow
import createProjectUser from './createProjectUser'
export * from './createProjectUser'

export type ProjectUser = {
  id: number,
  projectId: number,
  userId: number,
  role: string
}

export default {
  createProjectUser
}
