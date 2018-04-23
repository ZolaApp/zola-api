// @flow
import createProject from './createProject'
export * from './createProject'

export type Project = {
  id: number,
  name: string,
  slug: string
}

export default {
  createProject
}
