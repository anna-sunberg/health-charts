const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const BigInt = require('apollo-type-bigint');
const mergeResolvers = require('graphql-merge-resolvers');
const GraphQLDateTime = require('graphql-type-datetime');
const runningResolvers = require('./resolvers/running');

const resolvers = mergeResolvers.merge([
  runningResolvers,
  {
    BigInt,
    DateTime: GraphQLDateTime
  }
]);

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    prisma,
  },
})

server.start(() => console.log('Server is running on http://localhost:4000'))
