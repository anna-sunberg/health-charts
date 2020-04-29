const { times, round } = require('lodash');
const moment = require('moment');

const MIN_YEAR = 2017;
const DISTANCE_UNIT = 'km';
const getTotalDistance = (total, { totalDistance }) => total + totalDistance;

module.exports = {
  Query: {
    runningWorkouts: (parent, args, context) => (
      context.prisma.runningWorkouts()
    ),
    runningWorkout: (parent, { id }, context) => (
      context.prisma.runningWorkout({ id })
    ),
    runningTotalsByDay: async (parent, args, context) => {
      const now = moment.utc().startOf('year');
      const rawWorkouts = await context.prisma.runningWorkouts({
        where: {
          startDate_gt: `${MIN_YEAR}-01-01`
        }
      });
      const workouts = rawWorkouts.map((workout) => {
        const startDate = moment.utc(workout.startDate);
        const dayOfYear = startDate.dayOfYear();
        return {
          ...workout,
          year: startDate.get('year'),
          day: !startDate.isLeapYear() && dayOfYear > 59 ? dayOfYear + 1 : dayOfYear
        };
      });
      return times(now.get('year') - MIN_YEAR + 1, (yearOffset) => {
        const currentYear = MIN_YEAR + yearOffset;
        const allDays = times(366);
        const yearWorkouts = workouts.filter(({ year }) => year === currentYear);
        const yearlyTotalDistance = yearWorkouts.reduce(getTotalDistance, 0);
        let totalDistance = 0;
        const days = allDays.map((dayIndex) => {
          const monthWorkouts = yearWorkouts.filter(({ day }) => day === dayIndex);
          totalDistance += monthWorkouts.reduce(getTotalDistance, 0), 2;
          return {
            day: dayIndex,
            totalDistance: round(totalDistance),
            totalDistanceUnit: DISTANCE_UNIT,
            runningWorkouts: monthWorkouts
          };
        });
        return {
          days,
          year: currentYear,
          totalDistance: round(yearlyTotalDistance, 2),
          totalDistanceUnit: DISTANCE_UNIT
        }
      });
    },
    runningTotalsByMonth: async (parent, args, context) => {
      const now = moment.utc().startOf('year');
      const allMonths = times(12);
      const rawWorkouts = await context.prisma.runningWorkouts({
        where: {
          startDate_gt: `${MIN_YEAR}-01-01`
        }
      });
      const workouts = rawWorkouts.map((workout) => {
        const startDate = moment.utc(workout.startDate);
        return {
          ...workout,
          year: startDate.get('year'),
          month: startDate.get('month')
        };
      });
      return times(now.get('year') - MIN_YEAR + 1, (yearOffset) => {
        const currentYear = MIN_YEAR + yearOffset;
        const yearWorkouts = workouts.filter(({ year }) => year === currentYear);
        const yearlyTotalDistance = yearWorkouts.reduce(getTotalDistance, 0);
        const months = allMonths.map((monthIndex) => {
          const monthWorkouts = yearWorkouts.filter(({ month }) => month === monthIndex);
          const totalDistance = round(monthWorkouts.reduce(getTotalDistance, 0), 2);
          return { month: monthIndex, totalDistance, totalDistanceUnit: DISTANCE_UNIT, runningWorkouts: monthWorkouts };
        });
        return {
          months,
          year: currentYear,
          totalDistance: round(yearlyTotalDistance, 2),
          totalDistanceUnit: DISTANCE_UNIT
        }
      });
    },
    runningStats: () => ({})
  },
  Mutation: {
    createRunningWorkout(parent, workout, context) {
      return context.prisma.createRunningWorkout({
        ...workout
      });
    }
  },
  Stats: {
    weeklyStats: async (parent, args, context) => {
      const now = moment.utc();
      const start = moment.utc(now).startOf('week').add(-6, 'd');
      const startOfWeek = moment(now).startOf('week').add(1, 'd');
      const allWorkouts = await context.prisma.runningWorkouts({
        where: {
          startDate_gt: start.format('YYYY-MM-DD')
        }
      });
      const sumDistance = (sum, { totalDistance }) => sum + totalDistance;
      const lastPeriod = allWorkouts.filter(
          ({ startDate }) => moment.utc(startDate) < startOfWeek
        )
        .reduce(sumDistance, 0);
      const thisPeriod = allWorkouts.filter(({ startDate }) => moment.utc(startDate) >= startOfWeek)
        .reduce(sumDistance, 0);
      return { lastPeriod, thisPeriod };
    },
    recentWorkouts: (parent, workout, context) => (
      context.prisma.runningWorkouts({ orderBy: 'startDate_DESC', first: 10 })
    ),
    recentWorkout: async (parent, workout, context) => {
      const workouts = await context.prisma.runningWorkouts({ orderBy: 'startDate_DESC', first: 1 });
      if (workouts.length) {
        return workouts[0];
      }
      return null;
    }
  }
};
