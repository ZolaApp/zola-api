// @flow
import createProject from './createProject'
export * from './createProject'

export type Project = {
  id: string,
  userId: string,
  name: string,
  slug: string,
  description: string
}

export default {
  createProject
}
