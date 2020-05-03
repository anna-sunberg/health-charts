import React from 'react';
import moment from 'moment';
import { round } from 'lodash';

const HMS_FORMAT = 'HH:mm:ss';
const MS_FORMAT = 'mm:ss';

const formatDuration = duration => {
  return moment('00:00:00', HMS_FORMAT)
    .add(duration, 'm')
    .format(duration > 60 ? HMS_FORMAT : MS_FORMAT);
};

const WorkoutTile = ({ title, workout }) => (
  <div className="tile">
    <div className="tile__content">
      <div className="tile__title">{title}</div>
      <div>{moment(workout.endDate).format(`D.M.YYYY ${HMS_FORMAT}`)}</div>
      <div>{`${round(workout.totalDistance, 2)} ${workout.totalDistanceUnit}`}</div>
      <div>{formatDuration(workout.duration)}</div>
      <div>{`${workout.totalEnergyBurned} ${workout.totalEnergyBurnedUnit}`}</div>
    </div>
  </div>
);

export default WorkoutTile;
