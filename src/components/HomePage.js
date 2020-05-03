import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
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
      {runningStats.recentWorkout && (
        <WorkoutTile workout={runningStats.recentWorkout} title="Running • Latest" />
      )}
      <Tile
        title="Cycling • Week"
        primary={cyclingStats.weeklyStats.thisPeriod.distance}
        secondary={cyclingStats.weeklyStats.lastPeriod.distance}
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
          lastPeriod {
            count
            distance
            duration
          }
          thisPeriod {
            count
            distance
            duration
          }
        }
        recentWorkout {
          duration
          endDate
          pace
          totalDistance
          totalDistanceUnit
          totalEnergyBurned
          totalEnergyBurnedUnit
        }
      }
      cyclingStats {
        weeklyStats {
          lastPeriod {
            count
            distance
            duration
          }
          thisPeriod {
            count
            distance
            duration
          }
        }
        recentWorkout {
          duration
          endDate
          speed
          totalDistance
          totalDistanceUnit
          totalEnergyBurned
          totalEnergyBurnedUnit
        }
      }
    }
  }
`;

export default HomePage;
