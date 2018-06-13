// @flow
import addTranslationValueToTranslationKey from './mutations/addTranslationValueToTranslationKey'
import prefillTranslationValue from './mutations/prefillTranslationValue'
import deleteTranslationKey from './mutations/deleteTranslationKey'

export default {
  Mutation: {
    addTranslationValueToTranslationKey,
    prefillTranslationValue,
    deleteTranslationKey
  }
}
