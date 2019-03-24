import * as Query from './Query'
import * as Mutation from './Mutation'
import Type from './Type'

const resolvers = {
  Query,
  Mutation,
  ...Type
}

export default resolvers