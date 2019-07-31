/* eslint-disable camelcase */
const { gql } = require('apollo-server');
const { knex } = require('../db');

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
    movie(title: String): Movie
    director(name: String): Director
    movies: [Movie]
    directors: [Director]
  }
`;

const resolvers = {
  Query: {
    async movie(_, args) {
      const result = await knex('movies')
        .select('*')
        .where('title', args.title)
        .catch(() => []);

      if (result.lenght === 0) return null;

      const {
        id, title, genre, director_id,
      } = result[0];

      return {
        id,
        title,
        genre,
        directorID: director_id,
      };
    },
    async director(_, args) {
      const result = await knex
        .select('*')
        .from('directors')
        .where('name', args.name)
        .catch(() => []);

      if (result.length === 0) return null;

      return result[0];
    },
    async movies() {
      const result = await knex('movies')
        .select('*')
        .catch(() => []);

      return result;
    },
    async directors() {
      const result = await knex('directors')
        .select('*')
        .catch(() => []);

      return result;
    },
  },
  Director: {
    async movies(director) {
      const { id } = director;
      const result = await knex('movies')
        .select('*')
        .where('director_id', id)
        .catch(() => []);

      return result;
    },
  },
  Movie: {
    async director(movie) {
      const result = await knex('directors')
        .select('*')
        .where('id', movie.directorID)
        .catch(() => []);

      if (result.length === 0) return null;

      return result[0];
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
