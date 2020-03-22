import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Chart from 'react-apexcharts'
import moment from 'moment';
import { times } from 'lodash';

const RunningMonthlyPage = () => {
  const { loading, data } = useQuery(RUNNING_BY_MONTH_QUERY);
  if (loading) {
    return (<div>loading</div>);
  }
  const series = data.runningTotalsByMonth.map(({ year, months }) => ({
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
    <Chart type="bar" series={series} options={options} />
  )
}

export default RunningMonthlyPage;

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
