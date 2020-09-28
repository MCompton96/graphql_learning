const graphql = require('graphql');
const _ = require('lodash');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID,
    GraphQLInt,
    GraphQLList    
} = graphql;

var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', author_id: "1"},
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', author_id: "2"},
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', author_id: "3"},
    { name: "The Goblet of Fire", genre: "Fantasy", id: '4', author_id: "4"},
    { name: "The Order of the Phoenix", genre: "Fantasy", id: "5", author_id: "4"},
    { name: "The Fellowship of the Ring", genre: "Fantasy", id: "6", author_id: "5"}
];

var authors = [
    {name: 'Patrick Rothfuss', age: 44, id: '1'},
    {name: 'Brandon Sanderson', age: 42, id: '2'},
    {name: 'Terry Pratchett', age: 66, id: '3'},
    {name: "JK Rowling", age: 55, id: '4'},
    {name: 'JRR Tolkein', age: 81, id: '5'}
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return _.find(authors, {id: parent.author_id});
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return _.filter(books, { author_id: parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args) {
                //code to get data from db/ other source
                return _.find(books, { id: args.id });
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return _.find(authors, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});