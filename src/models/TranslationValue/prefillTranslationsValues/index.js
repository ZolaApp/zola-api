// @flow
import Translate from '@google-cloud/translate'
import Project from '@models/Project'
import Locale from '@models/Locale'
import TranslationValue from '@models/TranslationValue'
import supportedLocales from './supportedLocales'

const translate = new Translate({ key: process.env.TRANSLATE_API_KEY })

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

  const targetLanguage = newLocale.code.toLowerCase()
  const isLocaleSupported = supportedLocales.has(targetLanguage.toLowerCase())

  if (!isLocaleSupported) {
    throw new Error(
      'Sorry! We do not provide translations prefilling for this locale yet…'
    )
  }

  const translatedValues = await translate.translate(
    stringsToBeTranslated,
    targetLanguage
  )
  const result = translatedValues && translatedValues[0]

  if (result) {
    sortedKeys.forEach((translationKey, index) => {
      const translation = sortedKeys.find(key => key.key === translationKey.key)

      if (translation && result[index]) {
        const translationValue = new TranslationValue(result[index], newLocale)

        translationKey.translationValues.push(translationValue)
      }
    })
  }

  return project
}

export default prefillTranslationsValues
