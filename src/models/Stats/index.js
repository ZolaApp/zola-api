// @flow
class Stats {
  missingTranslationsCount: number
  newKeysCount: number
  completePercentage: number
  translationKeysCount: number
  projectsCount: number
  localesCount: number

  constructor(
    missingTranslationsCount: number,
    newKeysCount: number,
    completePercentage: number,
    translationKeysCount: number,
    localesCount: ?number,
    projectsCount: ?number
  ) {
    this.missingTranslationsCount = missingTranslationsCount
    this.newKeysCount = newKeysCount
    this.completePercentage = completePercentage
    this.translationKeysCount = translationKeysCount

    if (localesCount) {
      this.localesCount = localesCount
    }

    if (projectsCount) {
      this.projectsCount = projectsCount
    }
  }
}

export default Stats
