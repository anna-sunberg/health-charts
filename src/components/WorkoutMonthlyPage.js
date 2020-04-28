import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Chart from 'react-apexcharts'
import moment from 'moment';
import { get, times } from 'lodash';

const useDataQuery = (type) => {
  const query = type === 'cycling' ? CYCLING_BY_MONTH_QUERY : RUNNING_BY_MONTH_QUERY;
  const dataKey = type === 'cycling' ? 'cyclingTotalsByMonth' : 'runningTotalsByMonth';
  const { loading, data, error } = useQuery(query);
  return { error, loading, data: get(data, dataKey) };
}

const WorkoutMonthlyPage = ({ type }) => {
  const { loading, data } = useDataQuery(type);
  if (loading) {
    return (<div>loading</div>);
  }
  const series = data.map(({ year, months }) => ({
    name: year,
    data: months.map(({ totalDistance }) => totalDistance)
  }));
  const options = {
    xaxis: {
      categories: times(12),
      labels: {
        formatter: (d) => moment.utc().set('month', d).format('MMM')
      }
    },
    yaxis: {
      labels: {
        formatter: (d) => Math.round(d)
      }
    },
    tooltip: {
      shared: true,
      // custom: () => renderToString(<div>123</div>)
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
    dataLabels: {
      style: {
        fontFamily: 'Open Sans',
        colors: ['#555']
      },
      formatter: (d) => d || '',
      background: {
        enabled: true,
        foreColor: '#fff'
      },
      offsetY: 40
    }
  }

  return (
    <div className="chart-container">
      <Chart type="bar" series={series} options={options} />
    </div>
  )
}

export default WorkoutMonthlyPage;

const RUNNING_BY_MONTH_QUERY = gql`
  query RunningByMonthQuery {
    runningTotalsByMonth {
      year,
      totalDistance,
      months {
        month,
        totalDistance
      }
    }
  }
`;
const CYCLING_BY_MONTH_QUERY = gql`
  query CyclingByMonthQuery {
    cyclingTotalsByMonth {
      year,
      totalDistance,
      months {
        month,
        totalDistance
      }
    }
  }
`;
