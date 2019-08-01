/* eslint-disable camelcase */
const { gql } = require('apollo-server');
const { knex } = require('../db');
const loaders = require('./loaders');

const typeDefs = gql`
  type Movie {
    id: ID
    title: String!
    genre: String!
    directorID: ID!
    director: Director
  }

  type Director {
    id: ID
    name: String!
    age: Int!
    movies: [Movie]
  }

  type Query {
    movie(title: String, id: ID): Movie
    director(name: String, id: ID): Director
    movies(page: Int!): [Movie]
    directors(page: Int!): [Director]
  }
`;

const resolvers = {
  Query: {
    async movie(_, args) {
      let column;
      let value;

      if (args.id) {
        column = 'id';
        value = args.id;
      } else if (args.title) {
        column = 'title';
        value = args.title;
      } else {
        return null;
      }

      const result = await knex('movies')
        .select()
        .where(column, value);

      if (result.length === 0) return null;

      const record = result[0];

      return {
        id: record.id,
        title: record.title,
        genre: record.genre,
        directorID: record.director_id,
      };
    },
    async director(_, args) {
      let column;
      let value;

      if (args.id) {
        column = 'id';
        value = args.id;
      } else if (args.name) {
        column = 'name';
        value = args.name;
      } else {
        return null;
      }

      const result = await knex('directors')
        .select()
        .where(column, value);

      return result[0] ? result[0] : null;
    },
    async movies(_, args) {
      if (args.page < 1) return null;

      const result = await knex('movies')
        .select()
        .limit(20)
        .offset((args.page - 1) * 20)
        .catch(() => []);

      return result.map(obj => ({
        id: obj.id,
        title: obj.title,
        genre: obj.genre,
        directorID: obj.director_id,
      }));
    },
    async directors(_, args) {
      if (args.page < 1) return null;

      const offset = args.page - 1;
      const result = await knex('directors')
        .select('*')
        .limit(20)
        .offset(offset * 20)
        .catch(() => []);

      return result;
    },
  },
  Director: {
    async movies(director) {
      const result = await loaders.moviesByDirectorID.load(director.id);
      return result;
    },
  },
  Movie: {
    async director(movie) {
      const result = await loaders.directorByID.load(movie.directorID);
      return result;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
