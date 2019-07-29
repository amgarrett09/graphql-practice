/* eslint-disable no-use-before-define */
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
  {
    name: 'The Hero of Ages',
    genre: 'Fantasy',
    id: '4',
    author_id: '2',
  },
  {
    name: 'The Colour of Magic',
    genre: 'Fantasy',
    id: '5',
    author_id: '3',
  },
  {
    name: 'The Light Fantastic',
    genre: 'Fantasy',
    id: '6',
    author_id: '3',
  },
];
const authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Spanderson', age: 44, id: '2' },
  { name: 'Terry Pratchet', age: 44, id: '3' },
];

const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent) {
        return books.filter(book => book.author_id === parent.id);
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
      resolve(parent) {
        const result = authors.filter(author => author.id === parent.author_id);
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
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        const result = books.filter(book => book.id === args.id);
        return result[0] ? result[0] : null;
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        const result = authors.filter(author => author.id === args.id);
        return result[0] ? result[0] : null;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve() {
        return authors;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
