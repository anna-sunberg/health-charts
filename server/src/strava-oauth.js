const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const qs = require('qs');
const moment = require('moment');
const { prisma } = require('./generated/prisma-client');

const router = express();
router.get('/', (req, res) => {
  const uri = 'https://www.strava.com/oauth/authorize?' +
    qs.stringify({
      'client_id': process.env.OAUTH_CLIENT_ID,
      'redirect_uri': `${process.env.APP_URL}/auth/callback`,
      'response_type': 'code',
      'approval_prompt': 'auto',
      'scope': 'activity:read_all'
    });
  res.redirect(uri);
});

router.get('/callback', async (req, res, next) => {
  try {
    const { code } = req.query;
    const uri = 'https://www.strava.com/api/v3/oauth/token?' +
      qs.stringify({
        'client_id': process.env.OAUTH_CLIENT_ID,
        'client_secret': process.env.OAUTH_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code
      });
    const response = await fetch(uri, { method: 'post' });

    const {
      refresh_token: refreshToken,
      access_token: accessToken,
      expires_at: accessTokenExpiresAt,
      athlete: {
        id: stravaId,
        username: stravaUsername,
        firstname: firstName,
        lastname: lastName,
        sex
      }
    } = await response.json();

  let user = await prisma.user({ stravaId: `${stravaId}` });
  if (!user) {
    user = await prisma.createUser({
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      stravaId,
      stravaUsername,
      sex: sex === 'F' ? 'female' : 'male'
    });
  }

  res.cookie('jwt', jwt.sign(user.id, process.env.JWT_SECRET));
  res.redirect('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const checkAccessToken = async (user) => {
  if (moment(user.accessTokenExpiresAt * 1000) < moment.utc()) {
    const uri = `https://www.strava.com/api/v3/oauth/token?` +
      qs.stringify({
        'client_id': process.env.OAUTH_CLIENT_ID,
        'client_secret': process.env.OAUTH_CLIENT_SECRET,
        'grant_type': 'refresh_token',
        'refresh_token': user.refreshToken
      });

    const response = await fetch(uri, { method: 'post' });
    const { access_token: accessToken, expires_at: accessTokenExpiresAt } = await response.json();
    return  prisma.updateUser({
      data: {
        accessToken, accessTokenExpiresAt
      },
      where: {
        id: user.id
      }
    });
  }
  return user;
}

module.exports = { stravaOAuth: router, checkAccessToken };

