import React from 'react';

const Tile = ({ title, period, stats, unit }) => {
  return (
    <div className="tile">
      <div className="tile__content">
        <div className="tile__title">{title}</div>
        <>
          <div className="tile__primary-container">
            <div className="tile__primary">
              {stats.thisPeriod.distance}
              {unit && ` ${unit}`}
            </div>
          </div>
          <div className="tile__secondary">
            {`Last ${period}: `}
            {stats.lastPeriod.distance}
            {unit && ` ${unit}`}
          </div>
          {stats.thisPeriod.averagePace && (
            <div className="tile__secondary">{`Average pace: ${stats.thisPeriod.averagePace}`}</div>
          )}
          {stats.thisPeriod.averageSpeed && (
            <div className="tile__secondary">{`Average speed: ${
              stats.thisPeriod.averageSpeed
            }`}</div>
          )}
          <div className="tile__secondary">
            {`${stats.thisPeriod.count} workouts, ${stats.thisPeriod.duration} min`}
          </div>
        </>
      </div>
    </div>
  );
};

export default Tile;
