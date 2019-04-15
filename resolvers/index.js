import * as Query from './Query'
import * as Mutation from './Mutation'
import * as Type from './Type'
import * as Subscription from './Subscription'

const resolvers = {
  Query,
  Mutation,
  Subscription,
  ...Type
}

export default resolvers