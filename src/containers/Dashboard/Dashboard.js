import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signOut } from '../../modules/authentication';

const Dashboard = (props) => (
  <div>
    <h1>Dashboard</h1>
    <a onClick={props.signOut}>sign out</a>
  </div>
);

export default withRouter(connect(null, { signOut })(Dashboard));
