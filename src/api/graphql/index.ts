import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory';


export const client = new ApolloClient({
    uri: 'http://127.0.0.1:3000/graphql',
    cache: new InMemoryCache()
})