// @flow
import createProject from './mutations/createProject'
import addLocaleToProject from './mutations/addLocaleToProject'
import getProjects from './queries/getProjects'
import getProject from './queries/getProject'

export default {
  Mutation: {
    createProject,
    addLocaleToProject
  },
  Query: {
    getProjects,
    getProject
  }
}
