import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export const DateResolver = new GraphQLScalarType({
  name: 'Date',
  parseValue(value) {
    return new Date(value)
  },
  serialize(value) {
    return new Date(value).toISOString()
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value)
    return null
  },
})
