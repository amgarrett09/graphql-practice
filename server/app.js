const PORT = process.env.PORT || '5000';
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();
const { initializeTables } = require('./db');

initializeTables();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
