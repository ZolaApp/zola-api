import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'

import schema from '@api/schema'

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new SchemaLink({ schema })
})
