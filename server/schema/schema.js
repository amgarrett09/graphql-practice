/* eslint-disable no-use-before-define */
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

const {
  getByName, getById, getAll, insertOne,
} = require('../db');

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent) {
        const result = await getById('books', parent.id).catch(() => []);
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
        const result = await getById('authors', parent.id).catch(() => []);
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
        const result = await getByName('books', args.name).catch(() => []);
        return result[0] ? result[0] : null;
      },
    },
    author: {
      type: AuthorType,
      args: { name: { type: GraphQLString } },
      async resolve(parent, args) {
        const result = await getByName('authors', args.name).catch(() => []);
        return result[0] ? result[0] : null;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve() {
        const result = await getAll('books').catch(() => []);
        return result;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve() {
        const result = await getAll('authors').catch(() => []);
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
        const result = await insertOne(
          'authors',
          {
            name: args.name,
            age: args.age,
          },
          ['id', 'name', 'age'],
        ).catch(() => []);
        return result[0] ? result[0] : null;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
