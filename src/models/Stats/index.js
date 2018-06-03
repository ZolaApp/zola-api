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
  projectsCount: number
  localesCount: number

  constructor(args: StatsConstructor) {
    this.missingTranslationsCount = args.missingTranslationsCount
    this.newKeysCount = args.newKeysCount
    this.completePercentage = args.completePercentage
    this.translationKeysCount = args.translationKeysCount

    if (args.localesCount) {
      this.localesCount = args.localesCount
    }

    if (args.projectsCount) {
      this.projectsCount = args.projectsCount
    }
  }
}

export default Stats