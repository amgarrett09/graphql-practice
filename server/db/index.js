const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'admin',
    password: 'example',
    database: 'gql_tut',
  },
});

async function initializeTables() {
  // author
  let exists = await knex.schema.hasTable('authors');

  if (!exists) {
    try {
      await knex.raw(`
        CREATE TABLE authors (
          id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(200) NOT NULL,
          age INT,
          UNIQUE(name, age)
        ) 
      `);
      console.log('authors table created');
    } catch (err) {
      console.error(err);
    }
  }

  // books
  exists = await knex.schema.hasTable('books');
  if (!exists) {
    try {
      await knex.raw(`
        CREATE TABLE books (
          id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(200) NOT NULL,
          genre VARCHAR(50) NOT NULL,
          author_id UUID REFERENCES authors(id),
          UNIQUE(name, author_id)
        );
      `);
      console.log('books table created');
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = {
  initializeTables,
  knex,
};
