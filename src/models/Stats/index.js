// @flow
class Stats {
  missingTranslationsCount: number
  newKeysCount: number
  completePercentage: number
  projectsCount: number
  localesCount: number

  constructor(
    missingTranslationsCount: number,
    newKeysCount: number,
    completePercentage: number,
    localesCount: ?number,
    projectsCount: ?number
  ) {
    this.missingTranslationsCount = missingTranslationsCount
    this.newKeysCount = newKeysCount
    this.completePercentage = completePercentage

    if (localesCount) {
      this.localesCount = localesCount
    }

    if (projectsCount) {
      this.projectsCount = projectsCount || undefined
    }
  }
}

export default Stats
