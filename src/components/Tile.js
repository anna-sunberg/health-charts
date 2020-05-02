import React from 'react';

const Tile = ({ title, primary, secondary, unit, time }) => {
  return (
    <div className="tile">
      <div className="tile__content">
        <div className="tile__title">{title}</div>
        <div className="tile__primary-container">
          <div className="tile__primary">
            {primary}
            {unit && ` ${unit}`}
          </div>
        </div>
        {secondary && !time && (
          <div className="tile__secondary">{`${
            primary > secondary ? '↑' : '↓'
          } ${secondary} ${unit}`}</div>
        )}
        {secondary && time && <div className="tile__secondary">{secondary}</div>}
      </div>
    </div>
  );
};

export default Tile;
