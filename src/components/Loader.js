import React from 'react';

const Loader = ({ error }) => {
  if (error) {
    console.error(error);
    return <div>An error has occured</div>;
  }
  return <div className="loader">Loading...</div>;
};

export default Loader;
