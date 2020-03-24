const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const qs = require('qs');

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
      athlete: {
        id: athleteId,
        username,
        firstname,
        lastname
      }
    } = await response.json();
    res.cookie('jwt', jwt.sign(data.access_token, process.env.JWT_SECRET));
    res.redirect('/');
  });

  module.exports = router;

