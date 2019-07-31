const { ApolloServer } = require('apollo-server');

const { typeDefs, resolvers } = require('./graphql/schema');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { knex, initializeTables } = require('./db');

initializeTables(knex);

server.listen().then(({ url }) => {
  console.log(`Server listening at ${url}`);
});
