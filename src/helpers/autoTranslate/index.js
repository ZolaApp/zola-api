// @flow
import Translate from '@google-cloud/translate'
import supportedLocales from './supportedLocales'

const translate = new Translate({ key: process.env.TRANSLATE_API_KEY })

const autoTranslate = async (
  stringsToBeTranslated: Array<string> | string,
  targetLanguage: string
) => {
  targetLanguage = targetLanguage.toLowerCase()
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

  return translatedValues && translatedValues[0]
}

export default autoTranslate
