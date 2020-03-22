import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Chart from 'react-apexcharts';
import moment from 'moment';

const RunningDailyPage = () => {
  const { loading, data } = useQuery(RUNNING_BY_DAY_QUERY);
  if (loading) {
    return (<div>loading</div>);
  }
  const series = data.runningTotalsByDay.map(({ year, days }) => ({
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
    <Chart type="area" series={series} options={options} />
  )
}

export default RunningDailyPage;

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
