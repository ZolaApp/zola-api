// @flow
import TranslationKey from '@models/TranslationKey'
import type { ValidationError } from '@types/ValidationError'
import Locale from '@models/Locale'

export type TranslationKeysPageInput = {
  pageSize: number,
  page: number,
  projectId: number,
  filters: [?string],
  search: ?string
}

export type TranslationKeyPage = {
  page: number,
  pageSize: number,
  nextPage: ?number,
  previousPage: ?number,
  totalCount: ?number,
  translationKeys: Array<TranslationKey>,
  errors: Array<ValidationError>
}

const getPaginatedTranslationKeys = async ({
  pageSize,
  page,
  projectId,
  filters,
  search
}: TranslationKeysPageInput): Promise<TranslationKeyPage> => {
  const errors = []

  if (pageSize === null || page === null) {
    page = 0
    pageSize = 5
  }

  try {
    const query = TranslationKey.query()
      .where('translationKeys.projectId', '=', projectId)
      .orderBy('translationKeys.id', 'DESC')
      .page(page, pageSize)
      .eager('translationValues.locale')

    if (search) {
      query.andWhere('translationKeys.key', 'like', `%${search}%`)
    }

    if (filters.includes('hasMissingTranslations')) {
      const localesCount = await Locale.query()
        .join('projects_locales as pl', 'pl.localeId', 'locales.id')
        .join('projects', 'pl.projectId', 'projects.id')
        .where('projects.id', '=', projectId)
        .count()
        .pluck('count')
        .first()

      query
        .joinRaw(
          'LEFT OUTER JOIN "translationValues" on "translationValues"."translationKeyId" = "translationKeys".id'
        )
        .groupByRaw('"translationKeys".id')
        .havingRaw('COUNT("translationValues".id) < ?', localesCount)

      if (!filters.includes('isNew')) {
        query.andWhere('translationKeys.isNew', '=', false)
      }
    }

    if (
      filters.includes('isNew') &&
      !filters.includes('hasMissingTranslations')
    ) {
      query.andWhere('translationKeys.isNew', '=', true)
    }

    const results = await query

    const totalCount = results.total
    const translationKeys = results.results

    // We substract 1 because pages indexes start at 0
    const rawDivide = Math.floor(totalCount / pageSize) - 1
    const maxPage = totalCount % pageSize === 0 ? rawDivide : rawDivide + 1

    const previousPage = page === 0 ? 0 : page - 1
    const nextPage = page === maxPage ? maxPage : page + 1

    return {
      page,
      pageSize,
      nextPage,
      previousPage,
      totalCount: totalCount || 0,
      translationKeys,
      errors
    }
  } catch (error) {
    errors.push({ field: 'generic', message: error.message })

    return {
      page,
      pageSize,
      errors,
      previousPage: null,
      nextPage: null,
      totalCount: 0,
      translationKeys: []
    }
  }
}

export default getPaginatedTranslationKeys
