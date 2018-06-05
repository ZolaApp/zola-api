// @flow
import Project from '@models/Project'
import Locale from '@models/Locale'

const prefillTranslationsValues = async (
  project: Project,
  newLocale: Locale
) => {
  const defaultLocale = project.locales[0]

  console.log(defaultLocale)
}

export default prefillTranslationsValues
