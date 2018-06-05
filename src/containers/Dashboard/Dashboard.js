import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
  </div>
);

export default withRouter(connect()(Dashboard));
