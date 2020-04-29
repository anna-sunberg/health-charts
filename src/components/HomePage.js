import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import Loader from './Loader';

const HomePage = () => {
  const { loading, data, error } = useQuery(RUNNING_STATS_QUERY);
  if (loading || error) {
    return <Loader error={error} />;
  }

  const { weeklyStats, recentWorkout } = data.runningStats;
  return (
    <>
      <div>{`Last week: ${weeklyStats.lastPeriod}`}</div>
      <div>{`This week: ${weeklyStats.thisPeriod}`}</div>
      <div>{`Most recent workout: ${moment(recentWorkout.endDate).format('DD.MM.YYYY HH:mm')}`}</div>
    </>
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
