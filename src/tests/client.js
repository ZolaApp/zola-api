import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import schema from '@api/schema'

// Creating a client with a local schema allows us to not have to start a server
// during integration tests. We can make requests with this client instance as
// if we were making a request directly to an API.
export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new SchemaLink({
    schema,
    // @TODO spin up an actual server instead of mocking the request.
    context: { request: { user: { id: 1 } } }
  })
})
