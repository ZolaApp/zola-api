// @flow
import createProject from './mutations/createProject'
import addLocaleToProject from './mutations/addLocaleToProject'
import addTranslationKeyToProject from './mutations/addTranslationKeyToProject'
import addTranslationKeysToProject from './mutations/addTranslationKeysToProject'
import getProjects from './queries/getProjects'
import getProject from './queries/getProject'

export default {
  Mutation: {
    createProject,
    addLocaleToProject,
    addTranslationKeyToProject,
    addTranslationKeysToProject
  },
  Query: {
    getProjects,
    getProject
  }
}
