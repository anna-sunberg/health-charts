const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const qs = require('qs');
const moment = require('moment');
const { prisma } = require('./generated/prisma-client');
const importActivitiesFromStrava = require('./import');

const router = express();
router.get('/', (req, res) => {
  switch (req.query['hub.mode']) {
    case 'subscribe': {
      res.json({
        'hub.challenge': req.query['hub.challenge']
      });
      return;
    }
    default: {
      console.log(`Webhook skipped: GET /, hub.mode=${req.query['hub.mode']}`);
    }
  }
});

router.post('/', async (req, res) => {
  const body = req.body;
  console.log('Webhook received', body);
  if (body.object_type === 'activity') {
    switch (body.aspect_type) {
      case 'delete': {
        const runningRes = await prisma.deleteRunningWorkout({
          stravaId: `${body.object_id}`
        });
        const cyclingRes = await prisma.deleteCyclingWorkout({
          stravaId: `${body.object_id}`
        });
        console.log('Deleted running: ', runningRes);
        console.log('Deleted cycling: ', cyclingRes);
        break;
      }
      case 'create': {
        const ownerId = body.owner_id;
        const user = await prisma.user({ stravaId: `${ownerId}` });
        console.log(`Fetching activities for user id=${user.id}`);
        importActivitiesFromStrava(user);
        break;
      }
      default: {
        console.log(`Webhook skipped: POST /, aspect_type=${body.aspect_type}`);
      }
    }
  }
  res.sendStatus(200);
});

const createWebhookSubscription = async () => {
  const uri = `https://www.strava.com/api/v3/push_subscriptions?${qs.stringify({
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET
  })}`;
  const subscribeUri = `${uri}&${qs.stringify({
    callback_url: `${process.env.APP_URL}/webhook`,
    verify_token: 'HEALTH_CHARTS'
  })}`;
  try {
    const subscriptions = await (await fetch(uri, { method: 'get' })).json();
    console.log('Subscription status: ', subscriptions);
    if (subscriptions.length === 0) {
      const response = await fetch(subscribeUri, { method: 'post' });
      const newSubscription = await response.json();
      console.log('Webhook subscription created: ', newSubscription);
    }
  } catch (err) {
    console.error(`Failed to create subscription: ${err.message}`);
  }
};

module.exports = { stravaWebhook: router, createWebhookSubscription };
