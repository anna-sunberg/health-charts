const moment = require('moment');
const { round } = require('lodash');

const sumDistance = (sum, { totalDistance }) => sum + totalDistance;
const sumDuration = (sum, { duration }) => sum + duration;

const getCollection = (prisma, workoutType) => {
  if (workoutType === 'running') {
    return prisma.runningWorkouts;
  }
  if (workoutType === 'cycling') {
    return prisma.cyclingWorkouts;
  }
  return null;
};

const calcStats = (workouts, type) => {
  const distance = workouts.reduce(sumDistance, 0);
  const duration = workouts.reduce(sumDuration, 0);
  return {
    distance: Math.round(distance),
    duration: Math.round(duration),
    count: workouts.length,
    ...calcSpeed(distance, duration, type)
  };
};

const calcSpeed = (distance, duration, type) => {
  if (distance === 0) {
    return null;
  }
  if (type === 'running') {
    const pace = duration / distance;
    return {
      averagePace: `${moment()
        .startOf('h')
        .add(pace, 'm')
        .format('m:ss')} min/km`
    };
  }
  if (type === 'cycling') {
    return { averageSpeed: `${round((distance / duration) * 60, 2)} km/h` };
  }
  return null;
};

const getPeriodData = async (prisma, workoutType, lastPeriodStart, thisPeriodStart) => {
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
    lastPeriod: calcStats(lastPeriodWorkouts, workoutType),
    thisPeriod: calcStats(thisPeriodWorkouts, workoutType)
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
