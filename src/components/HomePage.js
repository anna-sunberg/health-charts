import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Loader from './Loader';
import Tile from './Tile';
import WorkoutTile from './WorkoutTile';

const HomePage = () => {
  const { loading, data, error } = useQuery(STATS_QUERY);
  if (loading || error) {
    return <Loader error={error} />;
  }

  const { cyclingStats, runningStats } = data.stats;
  return (
    <div className="home-page">
      <Tile
        title="Running • Week"
        primary={runningStats.weeklyStats.thisPeriod.distance}
        secondary={runningStats.weeklyStats.lastPeriod.distance}
        unit="km"
      />
      <Tile
        title="Running • Month"
        primary={runningStats.monthlyStats.thisPeriod.distance}
        secondary={runningStats.monthlyStats.lastPeriod.distance}
        unit="km"
      />
      {runningStats.recentWorkout && (
        <WorkoutTile workout={runningStats.recentWorkout} title="Running • Latest" />
      )}
      <Tile
        title="Cycling • Week"
        primary={cyclingStats.weeklyStats.thisPeriod.distance}
        secondary={cyclingStats.weeklyStats.lastPeriod.distance}
        unit="km"
      />
      <Tile
        title="Cycling • Month"
        primary={cyclingStats.monthlyStats.thisPeriod.distance}
        secondary={cyclingStats.monthlyStats.lastPeriod.distance}
        unit="km"
      />
      {cyclingStats.recentWorkout && (
        <WorkoutTile workout={cyclingStats.recentWorkout} title="Cycling • Latest" />
      )}
    </div>
  );
};

const STATS_QUERY = gql`
  query StatsQuery {
    stats {
      runningStats {
        weeklyStats {
          ...RunningTimePeriodFragment
        }
        monthlyStats {
          ...RunningTimePeriodFragment
        }
        recentWorkout {
          pace
          ...WorkoutFragment
        }
      }
      cyclingStats {
        weeklyStats {
          ...CyclingTimePeriodFragment
        }
        monthlyStats {
          ...CyclingTimePeriodFragment
        }
        recentWorkout {
          speed
          ...WorkoutFragment
        }
      }
    }
  }

  fragment PeriodStatsFragment on PeriodStats {
    count
    distance
    duration
  }

  fragment RunningPeriodStatsFragment on PeriodStats {
    averagePace
    ...PeriodStatsFragment
  }

  fragment RunningTimePeriodFragment on TimePeriodStats {
    lastPeriod {
      ...RunningPeriodStatsFragment
    }
    thisPeriod {
      ...RunningPeriodStatsFragment
    }
  }

  fragment CyclingPeriodStatsFragment on PeriodStats {
    averageSpeed
    ...PeriodStatsFragment
  }

  fragment CyclingTimePeriodFragment on TimePeriodStats {
    lastPeriod {
      ...CyclingPeriodStatsFragment
    }
    thisPeriod {
      ...CyclingPeriodStatsFragment
    }
  }

  fragment WorkoutFragment on Workout {
    duration
    endDate
    totalDistance
    totalDistanceUnit
    totalEnergyBurned
    totalEnergyBurnedUnit
  }
`;

export default HomePage;
