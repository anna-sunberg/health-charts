const { GraphQLServer } = require('graphql-yoga');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const { prisma } = require('./generated/prisma-client');
const BigInt = require('apollo-type-bigint');
const mergeResolvers = require('graphql-merge-resolvers');
const GraphQLDateTime = require('graphql-type-datetime');
const runningResolvers = require('./resolvers/running');
const importRunningFromStrava = require('./import');
const stravaOAuth = require('./strava-oauth');

const resolvers = mergeResolvers.merge([
  runningResolvers,
  {
    BigInt,
    DateTime: GraphQLDateTime
  }
]);

const server = new GraphQLServer({
  typeDefs: path.join(__dirname, 'schema.graphql'),
  resolvers,
  context: {
    prisma,
  },
});

server.express.use(cookieParser());
server.express.use('/auth', stravaOAuth);
server.express.route('/import').get(importRunningFromStrava);
server.express.use(express.static(path.join(__dirname, '../../', 'build')));
server.express.get('/*', (req, res, next) => {
  if (req.path.indexOf('/api') === 0) {
    next();
  } else {
    res.sendFile(path.join(__dirname, '../../', 'build', 'index.html'));
  }
});

const port = process.env.PORT || 4000;
server.start({
  port,
  endpoint: '/api',
  playground: '/api'
}, () => console.log(`Server is running on http://localhost:${port}`));
