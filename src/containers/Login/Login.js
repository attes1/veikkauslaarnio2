import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import { signIn, handleRedirectResult, verifyUser } from '../../modules/authentication';
import Spinner from '../../components/Spinner';

const InvitationCodeForm = reduxForm({ form: 'InvitationCodeForm' })(({ handleChange }) => {
  return (
  <label>
    <h1>Enter invitation code</h1>
    <Field component="input" type="text" name="invitationCode" onChange={handleChange} />
  </label>
)});

class Login extends Component {
  componentDidMount() {
    this.props.handleRedirectResult();
  }

  handleInvitationCodeChange = (evt) => {
    const code = evt.target.value;

    if (code.length === 6) {
      this.props.verifyUser(code);
    }
  };

  render() {
    if (this.props.auth.isHandlingRedirect) {
      return (
        <Spinner />
      );
    } else {
      return (
        <div>
          {this.props.auth.invitationCodeRequired ?
            <Fragment>
              <InvitationCodeForm handleChange={this.handleInvitationCodeChange} />
            </Fragment> :
            <Fragment>
              <h1>Login</h1>
              <a onClick={this.props.signIn}>Facebook</a>
            </Fragment>
          }
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { signIn, handleRedirectResult, verifyUser })(Login));
