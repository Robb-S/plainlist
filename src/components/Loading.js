import React from 'react';
import '../css/lists.css';
import '../css/loading.css';
import { Dots } from 'css-spinners-react';

const Loading = () => {
  return (
    <div className="main-loader">
      <div className="spindiv">
        <Dots />
      </div>
    </div>
  );

};

export default Loading;