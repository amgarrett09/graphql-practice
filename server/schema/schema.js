// dummy data
const books = [
  {
    name: 'Name of the Wind',
    genre: 'Fantasy',
    id: '1',
    author_id: '1',
  },
  {
    name: 'The Final Empire',
    genre: 'Fantasy',
    id: '2',
    author_id: '2',
  },
  {
    name: 'The Long Earth',
    genre: 'Sci-Fi',
    id: '3',
    author_id: '3',
  },
];
const authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Spanderson', age: 44, id: '2' },
  { name: 'Terry Pratchet', age: 44, id: '3' },
];

const graphql = require('graphql');
const find = require('lodash.find');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
} = graphql;

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
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
      resolve(parent) {
        return find(authors, { id: parent.author_id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return find(authors, { id: args.id });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
