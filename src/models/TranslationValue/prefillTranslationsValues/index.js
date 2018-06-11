// @flow
import Project from '@models/Project'
import Locale from '@models/Locale'
import TranslationValue from '@models/TranslationValue'
import autoTranslate from '@helpers/autoTranslate'

const prefillTranslationsValues = async (
  project: Project,
  newLocale: Locale
) => {
  const defaultLocale = project.locales[0]
  const sortedKeys = project.translationKeys.sort((a, b) => a.id - b.id)
  const stringsToBeTranslated = sortedKeys.map(translationKey => {
    const translationValue = translationKey.translationValues.find(
      translationValue => translationValue.locale.code === defaultLocale.code
    )

    return translationValue ? translationValue.value : ''
  })
  const translations = await autoTranslate(
    stringsToBeTranslated,
    newLocale.code
  )

  if (translations) {
    sortedKeys.forEach((translationKey, index) => {
      const translation = sortedKeys.find(key => key.key === translationKey.key)

      if (translation && translations[index]) {
        const translationValue = new TranslationValue(
          translations[index],
          newLocale
        )

        translationKey.translationValues.push(translationValue)
      }
    })
  }

  return project
}

export default prefillTranslationsValues
