const knexInstance = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'admin',
    password: 'example',
    database: 'gql_tut',
  },
});

async function initializeDirectors(knex) {
  const exists = await knex.schema.hasTable('directors');
  if (!exists) {
    await knex.raw(`
      CREATE TABLE directors (
        id SERIAL NOT NULL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        age INT NOT NULL
      );
    `);
    console.log('directors table created');
  }
}

async function initializeMovies(knex) {
  const exists = await knex.schema.hasTable('movies');
  if (!exists) {
    await knex.raw(`
      CREATE TABLE movies (
        id SERIAL NOT NULL PRIMARY KEY,
        title VARCHAR(300) NOT NULL,
        genre VARCHAR(150) NOT NULL,
        director_id INT NOT NULL REFERENCES directors(id),
        UNIQUE(title, director_id)
      );
    `);
    console.log('movies table created');
  }
}

async function initializeTables(knex) {
  await initializeDirectors(knex).catch(err => console.error(err));
  await initializeMovies(knex).catch(err => console.error(err));
}

module.exports = {
  knex: knexInstance,
  initializeTables,
};
