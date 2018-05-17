// @flow
import createProject from './mutations/createProject'
import addLocaleToProject from './mutations/addLocaleToProject'
import getProjects from './queries/getProjects'

export default {
  Mutation: {
    createProject,
    addLocaleToProject
  },
  Query: {
    getProjects
  }
}
