// @flow
import createProjectUser from './createProjectUser'
export * from './createProjectUser'

export type ProjectUserRole = 'OWNER' | 'CONTRIBUTOR'

export type ProjectUser = {
  id: string,
  userId: string,
  projectId: string,
  role: ProjectUserRole
}

export default {
  createProjectUser
}
