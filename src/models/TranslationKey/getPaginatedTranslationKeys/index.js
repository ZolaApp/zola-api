// @flow
import TranslationKey from '@models/TranslationKey'
import type { ValidationError } from '@types/ValidationError'

export type TranslationKeysPageInput = {
  pageSize: number,
  page: number,
  projectId: number
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
  projectId
}: TranslationKeysPageInput): Promise<TranslationKeyPage> => {
  const errors = []

  if (pageSize === null || page === null) {
    page = 0
    pageSize = 5
  }

  try {
    const query = await TranslationKey.query()
      .where('projectId', '=', projectId)
      .orderBy('id', 'DESC')
      .page(page, pageSize)
      .eager('translationValues.locale')

    const totalCount = query.total
    const translationKeys = query.results

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
      totalCount,
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
      totalCount: null,
      translationKeys: []
    }
  }
}

export default getPaginatedTranslationKeys
