/* eslint-disable no-use-before-define */
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = require('graphql');

const { knex } = require('../db');

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent) {
        const result = await knex('books')
          .select('*')
          .where('author_id', parent.id)
          .catch(() => []);

        return result;
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      async resolve(parent) {
        const result = await knex('authors')
          .select('*')
          .where('id', parent.author_id)
          .catch(() => []);

        return result[0] ? result[0] : null;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    book: {
      type: BookType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const result = await knex('books')
          .select('*')
          .where('name', args.name)
          .catch(() => []);

        return result[0] ? result[0] : null;
      },
    },
    author: {
      type: AuthorType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const result = await knex('authors')
          .select('*')
          .where('name', args.name)
          .catch(() => []);

        return result[0] ? result[0] : null;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve() {
        const result = await knex('books').select('*');
        return result;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve() {
        const result = await knex('authors').select('*');
        return result;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        const result = await knex('authors')
          .returning(['id', 'name', 'age'])
          .insert({
            name: args.name,
            age: args.age,
          });

        return result[0] ? result[0] : null;
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorName: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const author = await knex('authors')
          .select('id')
          .where('name', args.authorName)
          .catch(() => []);

        if (!author || author.length === 0) return null;

        const authorId = author[0].id;
        const result = await knex('books')
          .returning(['id', 'name', 'genre'])
          .insert({
            name: args.name,
            genre: args.genre,
            author_id: authorId,
          })
          .catch(() => []);

        return result[0] ? result[0] : null;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
