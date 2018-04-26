// @flow
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export default new GraphQLScalarType({
  name: 'Date',
  description: 'Date scalar type',

  parseValue(value: any): Date {
    return new Date(value)
  },

  serialize(value: any): number {
    return value.getTime()
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10)
    }

    return null
  }
})
