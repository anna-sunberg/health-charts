const moment = require('moment');

const sumDistance = (sum, { totalDistance }) => sum + totalDistance;
const sumDuration = (sum, { duration }) => sum + duration;

getCollection = (prisma, workoutType) => {
  if (workoutType === 'running') {
    return prisma.runningWorkouts;
  }
  if (workoutType === 'cycling') {
    return prisma.cyclingWorkouts;
  }
  return null;
};

getPeriodData = async (prisma, workoutType, lastPeriodStart, thisPeriodStart) => {
  const collection = getCollection(prisma, workoutType);
  const allWorkouts = await collection({
    where: {
      startDate_gt: lastPeriodStart.format('YYYY-MM-DD')
    }
  });

  const lastPeriodWorkouts = allWorkouts.filter(
    ({ startDate }) => moment.utc(startDate) < thisPeriodStart
  );
  const thisPeriodWorkouts = allWorkouts.filter(
    ({ startDate }) => moment.utc(startDate) >= thisPeriodStart
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

const getMonthlyStats = async (prisma, workoutType) => {
  const now = moment.utc();
  const startOfMonth = moment.utc(now).startOf('month');
  const startOfLastMonth = moment(startOfMonth).add(-1, 'month');

  return getPeriodData(prisma, workoutType, startOfLastMonth, startOfMonth);
};

const getWeeklyStats = async (prisma, workoutType) => {
  const now = moment.utc();
  const startOfLastWeek = moment
    .utc(now)
    .startOf('isoWeek')
    .add(-7, 'd');
  const startOfWeek = moment(now).startOf('isoWeek');

  return getPeriodData(prisma, workoutType, startOfLastWeek, startOfWeek);
};

module.exports.getWeeklyStats = getWeeklyStats;
module.exports.getMonthlyStats = getMonthlyStats;
