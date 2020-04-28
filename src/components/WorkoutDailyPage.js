import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Chart from 'react-apexcharts';
import moment from 'moment';

const useDataQuery = (type) => {
  const query = type === 'cycling' ? CYCLING_BY_DAY_QUERY : RUNNING_BY_DAY_QUERY;
  const dataKey = type === 'cycling' ? 'cyclingTotalsByDay' : 'runningTotalsByDay';
  const { loading, data } = useQuery(query);
  return { loading, data: loading ? null : data[dataKey] };
}

const WorkoutDailyPage = ({ type }) => {
  const { loading, data } = useDataQuery(type);
  if (loading) {
    return (<div>loading</div>);
  }
  const series = data.map(({ year, days }) => ({
    name: year,
    data: days.map(({ day, totalDistance }) => [day, totalDistance])
  }));
  const options = {
    xaxis: {
      type: 'datetime',
      tickAmount: 12,
      min: 0,
      max: 365,
      labels: {
        formatter: (d) => d !== undefined && moment.utc().startOf('year').add(d + 1, 'day').format('MMM')
      }
    },
    yaxis: {
      labels: {
        formatter: (d) => Math.round(d)
      }
    },
    tooltip: {
      shared: true,
      x: {
        formatter: (d) => d !== undefined && moment.utc().startOf('year').add(d, 'day').format('DD MMM')
      }
    },
    theme: {
      palette: 'palette8'
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top'
        }
      }
    },
    stroke: {
      curve: 'smooth'
    },
    dataLabels: {
      enabled: false
    }
  }

  return (
    <div className="chart-container">
      <Chart type="area" series={series} options={options} />
    </div>
  )
}

export default WorkoutDailyPage;

const RUNNING_BY_DAY_QUERY = gql`
  query RunningByDayQuery {
    runningTotalsByDay {
      year,
      totalDistance,
      days {
        day,
        totalDistance
      }
    }
  }
`;
const CYCLING_BY_DAY_QUERY = gql`
  query CyclingByDayQuery {
    cyclingTotalsByDay {
      year,
      totalDistance,
      days {
        day,
        totalDistance
      }
    }
  }
`;
