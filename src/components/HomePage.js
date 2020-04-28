import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const HomePage = () => {
  const { loading, data, error } = useQuery(RUNNING_STATS_QUERY);
  if (loading) {
    return (<div>loading</div>);
  }
  if (error) {
    console.error(error);
    return (<div>error</div>);
  }

  return (
    <>
      <div>{`Last week: ${data.runningStats.lastWeek}`}</div>
      <div>{`This week: ${data.runningStats.thisWeek}`}</div>
    </>
  );
}

const RUNNING_STATS_QUERY = gql`
  query RunningStatsQuery {
    runningStats {
      thisWeek
      lastWeek
    }
  }
`;

export default HomePage;
