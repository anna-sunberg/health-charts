import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import Loader from './Loader';
import Tile from './Tile';

const HomePage = () => {
  const { loading, data, error } = useQuery(RUNNING_STATS_QUERY);
  if (loading || error) {
    return <Loader error={error} />;
  }

  const { weeklyStats, recentWorkout } = data.runningStats;
  return (
    <div className="home-page">
      <Tile
        title="Running • Week"
        primary={weeklyStats.thisPeriod}
        secondary={weeklyStats.lastPeriod} unit="km"
      />
      <Tile
        title="Running • Latest"
        time
        primary={moment(recentWorkout.endDate).format('DD.MM.YYYY')}
        secondary={moment(recentWorkout.endDate).format('HH:mm')}
      />
    </div>
  );
}

const RUNNING_STATS_QUERY = gql`
  query RunningStatsQuery {
    runningStats {
      weeklyStats {
        lastPeriod
        thisPeriod
      }
      recentWorkout {
        endDate
      }
      recentWorkouts {
        endDate
      }
    }
  }
`;

export default HomePage;
