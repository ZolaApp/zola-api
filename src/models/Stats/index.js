// @flow
export type StatsConstructor = {
  missingTranslationsCount: number,
  newKeysCount: number,
  completePercentage: number,
  translationKeysCount: number,
  localesCount: ?number,
  projectsCount: ?number
}

class Stats {
  missingTranslationsCount: number
  newKeysCount: number
  completePercentage: number
  translationKeysCount: number
  projectsCount: ?number
  localesCount: ?number

  constructor({
    missingTranslationsCount,
    newKeysCount,
    completePercentage,
    translationKeysCount,
    localesCount,
    projectsCount
  }: StatsConstructor) {
    this.missingTranslationsCount = missingTranslationsCount
    this.newKeysCount = newKeysCount
    this.completePercentage = completePercentage
    this.translationKeysCount = translationKeysCount
    this.localesCount = localesCount
    this.projectsCount = projectsCount
  }
}

export default Stats
