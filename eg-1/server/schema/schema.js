const gaphql = require('graphql');
var ld = require('lodash');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = gaphql

// const {RootQuery} = eql.graphql

// types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User type',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},

        posts: {
            type: new GraphQLList(PostType),
            resolve: (parent, args) => {
                return ld.filter(postsData, {userId: parent.id})
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve: (parent, args) => {
                return ld.filter(hobbiesData, {userId: parent.id})
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby type',
    fields: ()=>({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: { 
            type: UserType,
            resolve: (parent, args) => {
                return ld.find(usersData, {id: parent.userId})
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post type',
    fields: ()=>({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: { 
            type: UserType,
            resolve: (parent, args) => {
                return ld.find(usersData, {id: parent.userId})
            }
        }
    })
});

const usersData = [
    {id: "111", name: "aaa", age: 111, profession: "Developer"},
    {id: "112", name: "aab", age: 112, profession: "Engineering Manager"},
    {id: "211", name: "baa", age: 211, profession: "Developer"},
    {id: "231", name: "bca", age: 231, profession: "Lead Engineer"},
    {id: "321", name: "cba", age: 321, profession: "QA Engineer"},
    {id: "326", name: "cbf", age: 326, profession: "Developer"},
];

const hobbiesData = [
    {id: '1', title: 'Programming', description: 'Writing hobby firmware and software', userId: '111'},
    {id: '2', title: 'Rowing', description: 'Rowing', userId: '321'},
    {id: '3', title: 'Swimming', description: 'Competitive swimming', userId: '111'},
    {id: '4', title: 'Photography', description: 'Bird photography', userId: '321'},
    {id: '5', title: 'Hiking', description: 'Hiking through the woods', userId: '111'},
];

const postsData = [
    {id: '1', comment: 'Writing hobby firmware and software', userId: '111'},
    {id: '2', comment: 'Rowing', userId: '211'},
    {id: '3', comment: 'Competitive swimming', userId: '326'},
    {id: '4', comment: 'This is how you change the world!', userId: '321'},
    {id: '5', comment: 'Hello world!', userId: '111'},
];

// Root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return ld.find(usersData, {id: args.id});
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return ld.find(hobbiesData, {id: args.id});
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return ld.find(postsData, {id: args.id});
            }
        }
    }
});

const MAX = 10000;

// mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString},
            },

            resolve(parent, args) {
                let user = {
                    name: args.name,
                    age: args.age,
                    profession: args.profession,
                    id: Math.floor(Math.random() * MAX)
                }
                return user;
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
