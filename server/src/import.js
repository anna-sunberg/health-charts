const fetch = require('node-fetch');
const moment = require('moment');
const qs = require('qs');
const { prisma } = require('./generated/prisma-client');
const { checkAccessToken } = require('./strava-oauth');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
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
