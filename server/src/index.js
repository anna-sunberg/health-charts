const { GraphQLServer } = require('graphql-yoga');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
const { prisma } = require('./generated/prisma-client');
const BigInt = require('apollo-type-bigint');
const mergeResolvers = require('graphql-merge-resolvers');
const GraphQLDateTime = require('graphql-type-datetime');
const cyclingResolvers = require('./resolvers/cycling');
const runningResolvers = require('./resolvers/running');
const importActivitiesFromStrava = require('./import');
const { stravaOAuth, checkAccessToken } = require('./strava-oauth');
const { stravaWebhook, createWebhookSubscription } = require('./strava-webhook');

const resolvers = mergeResolvers.merge([
  cyclingResolvers,
  runningResolvers,
  {
    BigInt,
    DateTime: GraphQLDateTime,
    Query: { stats: () => ({}) }
  }
]);

const server = new GraphQLServer({
  typeDefs: path.join(__dirname, 'schema.graphql'),
  resolvers,
  context: session => ({ prisma, user: session.request.user })
});

if (process.env.NODE_ENV !== 'development') {
  createWebhookSubscription();
}

server.express.use(cookieParser());
server.express.use(bodyParser.json());
server.express.all('*', async (req, res, next) => {
  if (req.path.indexOf('/auth') === 0 || req.path.indexOf('/webhook') === 0) {
    next();
  } else {
    if (!req.cookies.jwt) {
      return res.redirect('/auth');
    }
    try {
      const userId = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      const user = await prisma.user({ id: userId });
      if (!user) {
        return res.redirect('/auth');
      }
      const updatedUser = await checkAccessToken(user);
      req.user = updatedUser;
    } catch (err) {
      console.log(err);
    }
    next();
  }
});
server.express.use('/auth', stravaOAuth);
server.express.use('/webhook', stravaWebhook);
server.express.route('/import').get((req, res) => importActivitiesFromStrava(req.user));
server.express.use(express.static(path.join(__dirname, '../../', 'build')));
server.express.get('/*', (req, res, next) => {
  if (req.path.indexOf('/api') === 0) {
    next();
  } else {
    res.sendFile(path.join(__dirname, '../../', 'build', 'index.html'));
  }
});

const port = process.env.PORT || 4000;
server.start(
  {
    port,
    endpoint: '/api',
    playground: '/api'
  },
  () => console.log(`Server is running on http://localhost:${port}`)
);
