// @flow
import Project from '@models/Project'
import Locale from '@models/Locale'

const prefillTranslationsValues = async (
  project: Project,
  newLocale: Locale
) => {
  console.log(project, newLocale)
}

export default prefillTranslationsValues
