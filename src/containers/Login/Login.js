import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signIn, handleRedirectResult } from '../../modules/authentication';
import Spinner from '../../components/Spinner';

class Login extends Component {
  componentDidMount() {
    this.props.handleRedirectResult();
  }

  render() {
    return (
      <div>
        {!this.props.auth.isHandlingRedirect ?
          <Fragment>
            <h1>Login</h1>
            <a onClick={() => this.props.signIn('')}>Facebook</a>
          </Fragment> :
          <Spinner />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { signIn, handleRedirectResult })(Login));
