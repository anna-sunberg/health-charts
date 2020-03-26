const fetch = require('node-fetch');
const moment = require('moment');
const qs = require('qs');
const { prisma } = require('./generated/prisma-client');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    if (moment(req.user.accessTokenExpiresAt * 1000) < moment.utc()) {
      const uri = `https://www.strava.com/api/v3/oauth/token?` +
        qs.stringify({
          'client_id': process.env.OAUTH_CLIENT_ID,
          'client_secret': process.env.OAUTH_CLIENT_SECRET,
          'grant_type': 'refresh_token',
          'refresh_token': req.user.refreshToken
        });

      const response = await fetch(uri, { method: 'post' });
      const { access_token: accessToken, expires_at: accessTokenExpiresAt } = await response.json();
      const updatedUser = await prisma.updateUser({
        data: {
          accessToken, accessTokenExpiresAt
        },
        where: {
          id: req.user.id
        }
      });
      req.user = updatedUser;
    }
    const { accessToken } = req.user;
    // TODO: check workout owner
    const [latest] = await prisma.runningWorkouts({
      orderBy: 'startDate_ASC',
      last: 1
    });

    const startDate = moment.utc(latest.startDate).valueOf() / 1000;
    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${startDate}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (response.status === 401) {
      throw new Error('STRAVA_UNAUTHORIZED');
    }
    const activityList = await response.json();

    const ids = activityList.reverse().map(({ id }) => id);
    await Promise.all(activityList.reverse().map(async ({ id }) => {
      const response = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const activity = await response.json();
      await prisma.createRunningWorkout({
        email: 'cofetty@gmail.com',
        startDate: moment.utc(activity.start_date).format(),
        endDate: moment.utc(activity.start_date).add(activity.elapsed_time).format(),
        totalDistance: activity.distance / 1000,
        totalDistanceUnit: 'km',
        duration: activity.elapsed_time / 60,
        totalAscent: activity.total_elevation_gain / 1000,
        totalAscentUnit: 'km',
        totalEnergyBurned: activity.calories,
        totalEnergyBurnedUnit: 'kcal',
        sourceName: 'strava'
      });
    }));

    res.json({ inserted: activityList.length });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
