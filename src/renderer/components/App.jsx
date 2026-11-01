import React from 'react';
import Report from './Report';
import { Image } from 'react-bootstrap';

const App = () => (
  <>
    <div className="content-container">
      <div className="container-fluid d-flex flex-column" style={{ width: '100px', height: 'auto' }} >
        <Image src='./lg.svg' rounded />
      </div>
      <Report />
    </div>
  </>
);

export default App;
