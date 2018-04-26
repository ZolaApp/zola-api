// @flow
import createProjectUser from './createProjectUser'
export * from './createProjectUser'

export type ProjectUserRole = 'OWNER' | 'CONTRIBUTOR'

export type ProjectUser = {
  id: string,
  projectId: string,
  userId: string,
  role: ProjectUserRole
}

export default {
  createProjectUser
}
