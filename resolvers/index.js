import * as Query from './Query'
import * as Mutation from './Mutation'
import * as Type from './Type'

console.log(Type);

const resolvers = {
  Query,
  Mutation,
  ...Type
}

export default resolvers