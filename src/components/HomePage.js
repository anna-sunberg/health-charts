import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import Loader from './Loader';
import Tile from './Tile';

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
        primary={runningStats.weeklyStats.thisPeriod}
        secondary={runningStats.weeklyStats.lastPeriod}
        unit="km"
      />
      <Tile
        title="Running • Latest"
        time
        primary={moment(runningStats.recentWorkout.endDate).format('DD.MM.YYYY')}
        secondary={moment(runningStats.recentWorkout.endDate).format('HH:mm')}
      />
      <Tile
        title="Cycling • Week"
        primary={cyclingStats.weeklyStats.thisPeriod}
        secondary={cyclingStats.weeklyStats.lastPeriod}
        unit="km"
      />
      <Tile
        title="Cycling • Latest"
        time
        primary={moment(cyclingStats.recentWorkout.endDate).format('DD.MM.YYYY')}
        secondary={moment(cyclingStats.recentWorkout.endDate).format('HH:mm')}
      />
    </div>
  );
};

const STATS_QUERY = gql`
  query StatsQuery {
    stats {
      runningStats {
        weeklyStats {
          lastPeriod
          thisPeriod
        }
        recentWorkout {
          endDate
        }
        recentWorkouts(limit: 1) {
          endDate
        }
      }
      cyclingStats {
        weeklyStats {
          lastPeriod
          thisPeriod
        }
        recentWorkout {
          endDate
        }
        recentWorkouts(limit: 1) {
          endDate
        }
      }
    }
  }
`;

export default HomePage;
