const { times, round } = require('lodash');
const moment = require('moment');
const { getWeeklyStats, getMonthlyStats } = require('../helpers/period-stats');

const MIN_YEAR = 2017;
const DISTANCE_UNIT = 'km';
const getTotalDistance = (total, { totalDistance }) => total + totalDistance;

module.exports = {
  Query: {
    cyclingWorkouts: (parent, args, context) => context.prisma.cyclingWorkouts(),
    cyclingWorkout: (parent, { id }, context) => context.prisma.cyclingWorkout({ id }),
    cyclingTotalsByDay: async (parent, args, context) => {
      const now = moment.utc().startOf('year');
      const rawWorkouts = await context.prisma.cyclingWorkouts({
        where: {
          startDate_gt: `${MIN_YEAR}-01-01`
        }
      });
      const workouts = rawWorkouts.map(workout => {
        const startDate = moment.utc(workout.startDate);
        const dayOfYear = startDate.dayOfYear();
        return {
          ...workout,
          year: startDate.get('year'),
          day: !startDate.isLeapYear() && dayOfYear > 59 ? dayOfYear + 1 : dayOfYear
        };
      });
      return times(now.get('year') - MIN_YEAR + 1, yearOffset => {
        const currentYear = MIN_YEAR + yearOffset;
        const allDays = times(366);
        const yearWorkouts = workouts.filter(({ year }) => year === currentYear);
        const yearlyTotalDistance = yearWorkouts.reduce(getTotalDistance, 0);
        let totalDistance = 0;
        const days = allDays.map(dayIndex => {
          const monthWorkouts = yearWorkouts.filter(({ day }) => day === dayIndex);
          (totalDistance += monthWorkouts.reduce(getTotalDistance, 0)), 2;
          return {
            day: dayIndex,
            totalDistance: round(totalDistance),
            totalDistanceUnit: DISTANCE_UNIT,
            cyclingWorkouts: monthWorkouts
          };
        });
        return {
          days,
          year: currentYear,
          totalDistance: round(yearlyTotalDistance, 2),
          totalDistanceUnit: DISTANCE_UNIT
        };
      });
    },
    cyclingTotalsByMonth: async (parent, args, context) => {
      const now = moment.utc().startOf('year');
      const allMonths = times(12);
      const rawWorkouts = await context.prisma.cyclingWorkouts({
        where: {
          startDate_gt: `${MIN_YEAR}-01-01`
        }
      });
      const workouts = rawWorkouts.map(workout => {
        const startDate = moment.utc(workout.startDate);
        return {
          ...workout,
          year: startDate.get('year'),
          month: startDate.get('month')
        };
      });
      return times(now.get('year') - MIN_YEAR + 1, yearOffset => {
        const currentYear = MIN_YEAR + yearOffset;
        const yearWorkouts = workouts.filter(({ year }) => year === currentYear);
        const yearlyTotalDistance = yearWorkouts.reduce(getTotalDistance, 0);
        const months = allMonths.map(monthIndex => {
          const monthWorkouts = yearWorkouts.filter(({ month }) => month === monthIndex);
          const totalDistance = round(monthWorkouts.reduce(getTotalDistance, 0), 2);
          return {
            month: monthIndex,
            totalDistance,
            totalDistanceUnit: DISTANCE_UNIT,
            cyclingWorkouts: monthWorkouts
          };
        });
        return {
          months,
          year: currentYear,
          totalDistance: round(yearlyTotalDistance, 2),
          totalDistanceUnit: DISTANCE_UNIT
        };
      });
    }
  },
  Mutation: {
    createCyclingWorkout(parent, workout, context) {
      return context.prisma.createcyclingWorkout({
        ...workout
      });
    }
  },
  Workout: {
    speed: ({ duration, totalDistance, totalDistanceUnit }) =>
      `${round(totalDistance / (duration / 60), 2)} ${totalDistanceUnit}/h`
  },
  Stats: { cyclingStats: () => ({}) },
  CyclingStats: {
    monthlyStats: async (parent, args, context) => getMonthlyStats(context.prisma, 'cycling'),
    weeklyStats: async (parent, args, context) => getWeeklyStats(context.prisma, 'cycling'),
    recentWorkouts: (parent, { limit }, context) =>
      context.prisma.cyclingWorkouts({ orderBy: 'startDate_DESC', first: limit }),
    recentWorkout: async (parent, args, context) => {
      const workouts = await context.prisma.cyclingWorkouts({
        orderBy: 'startDate_DESC',
        first: 1
      });
      if (workouts.length) {
        return workouts[0];
      }
      return null;
    }
  }
};
