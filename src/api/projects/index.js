// @flow
import createProject from './mutations/createProject'
import addLocaleToProject from './mutations/addLocaleToProject'
import addTranslationKeyToProject from './mutations/addTranslationKeyToProject'
import getProjects from './queries/getProjects'
import getProject from './queries/getProject'

export default {
  Mutation: {
    createProject,
    addLocaleToProject,
    addTranslationKeyToProject
  },
  Query: {
    getProjects,
    getProject
  }
}
