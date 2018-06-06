import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import styled from 'styled-components';
import { Container, Row, Col, media } from 'styled-bootstrap-grid';
import { signIn, verifyUser } from '../../modules/authentication';
import Spinner from '../../components/Spinner';
import { FacebookLoginButton, GoogleLoginButton } from './Buttons';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.lapisZapuli};
`;

const Title = styled.h1`
  text-align: center;
  margin-top: 0;
  color: rgba(255,224,102,1);
  -webkit-text-stroke: 0.1px rgba(81,81,79,1);
  font-size: 3rem;
  font-weight: bold;
  letter-spacing: -3px;
  text-transform: uppercase;

  ${media.md`
    font-size: 4rem;
  `}
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  input {
    display: flex;
    letter-spacing: 1rem;
    height: 3rem;
    width: 13rem;
    padding-left: 2rem;
    text-transform: uppercase;
    color: transparent;
    text-shadow: 0 0 0 ${props => props.theme.jetBlack};
    font-weight: bold;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.darkLiver};
    outline-color: ${props => props.theme.mustard};
  }
`;

const LabelTitle = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
`;

const InvitationCodeForm = reduxForm({ form: 'InvitationCodeForm' })(({ handleChange }) => {
  return (
    <InputContainer>
      <LabelTitle>Enter invitation code</LabelTitle>
      <Field
        component="input"
        type="text"
        name="invitationCode"
        onChange={handleChange}
        placeholder="******"
        maxLength="6" />
    </InputContainer>
  );
});

class Login extends Component {
  handleInvitationCodeChange = (evt) => {
    const code = evt.target.value;

    if (code.length === 6) {
      evt.target.blur();
      this.props.verifyUser(code.toUpperCase());
    }
  };

  render() {
    if (this.props.auth.isAuthenticating) {
      return (
        <Spinner />
      );
    } else {
      return (
        <Wrapper>
          <Container>
            <Row alignItems="center" justifyContent="center">
              <Col sm={12} md={8} lg={6}>
                <Title>Veikkauslaarnio</Title>
                {this.props.auth.invitationCodeRequired ?
                  <Fragment>
                    <InvitationCodeForm handleChange={this.handleInvitationCodeChange} />
                  </Fragment> :
                  <Fragment>
                    <FacebookLoginButton onClick={() => this.props.signIn('facebook')}>
                      Sign in with Facebook
                    </FacebookLoginButton>
                    <GoogleLoginButton onClick={() => this.props.signIn('google')}>
                      Sign in with Google
                    </GoogleLoginButton>
                  </Fragment>
                }
              </Col>
            </Row>
          </Container>
        </Wrapper>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { signIn, verifyUser })(Login));
