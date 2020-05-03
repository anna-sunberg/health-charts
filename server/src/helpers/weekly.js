const moment = require('moment');

const sumDistance = (sum, { totalDistance }) => sum + totalDistance;
const sumDuration = (sum, { duration }) => sum + duration;

const getWeeklyStats = async (prisma, workoutType) => {
  const collection = workoutType === 'running' ? prisma.runningWorkouts : prisma.cyclingWorkouts;
  const now = moment.utc();
  const startOfLastWeek = moment
    .utc(now)
    .startOf('isoWeek')
    .add(-7, 'd');
  const startOfWeek = moment(now).startOf('isoWeek');

  const allWorkouts = await collection({
    where: {
      startDate_gt: startOfLastWeek.format('YYYY-MM-DD')
    }
  });
  const lastPeriodWorkouts = allWorkouts.filter(
    ({ startDate }) => moment.utc(startDate) < startOfWeek
  );
  const thisPeriodWorkouts = allWorkouts.filter(
    ({ startDate }) => moment.utc(startDate) >= startOfWeek
  );

  return {
    lastPeriod: {
      distance: Math.round(lastPeriodWorkouts.reduce(sumDistance, 0)),
      count: lastPeriodWorkouts.length,
      duration: Math.round(lastPeriodWorkouts.reduce(sumDuration, 0))
    },
    thisPeriod: {
      distance: Math.round(thisPeriodWorkouts.reduce(sumDistance, 0)),
      count: thisPeriodWorkouts.length,
      duration: Math.round(thisPeriodWorkouts.reduce(sumDuration, 0))
    }
  };
};

module.exports.getWeeklyStats = getWeeklyStats;
