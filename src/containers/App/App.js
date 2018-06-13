import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styledNormalize from 'styled-normalize'
import styled, { injectGlobal, ThemeProvider } from 'styled-components'
import { injectLayoutBaseCSS } from 'styled-bootstrap-grid';
import ReactBreakpoints from 'react-breakpoints'
import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'
import { routerActions } from 'react-router-redux'
import { Container } from 'styled-bootstrap-grid';
import { checkAuth } from '../../modules/authentication';
import Login from '../Login';
import Dashboard from '../Dashboard';
import Profile from '../Profile';
import PrivaryPolicy from '../PrivacyPolicy';
import Header from '../../components/Header';

const breakpoints = {
  sm: 575,
  md: 768,
  lg: 992,
  xl: 1200
};

const defaultTheme = {
  jetBlack: '#131516',
  raven: '#373D3F',
  asher: '#555F61',
  stone: '#707C80',
  gray: '#8C979A',
  sterling: '#A7B0B2',
  heather: '#C1C7C9',
  pearl: '#DADEDF',
  lilia: '#F2F3F4',
  smoke: '#FCFCFC',

  darkLiver: 'rgba(81, 81, 79, 1)',
  sunsetOrange: 'rgba(242, 94, 92, 1)',
  mustard: 'rgba(255, 224, 102, 1)',
  lapisZapuli: 'rgba(35, 123, 160, 1)',
  greenSheen: 'rgba(112, 193, 178, 1)'
};

injectLayoutBaseCSS();
injectGlobal`
  ${styledNormalize}

  @import url('https://fonts.googleapis.com/css?family=Fjalla+One');
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700,700i');

  body {
    font-family: 'Noto Sans', sans-serif;
    color: ${defaultTheme.jetBlack};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Fjalla One', sans-serif;
  }
`

const Wrapper = styled.main`
  padding-top: 2rem;
  padding-bottom: 3rem;
`;

const userIsAuthenticatedRedirect = connectedReduxRedirect({
 redirectPath: '/login',
 authenticatedSelector: state => !!state.auth.user && !state.auth.invitationCodeRequired,
 wrapperDisplayName: 'UserIsAuthenticatedRedirect',
 redirectAction: routerActions.replace
});

const locationHelper = locationHelperBuilder({});
const userIsNotAuthenticatedRedirect = connectedReduxRedirect({
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/dashboard',
  allowRedirectBack: false,
  authenticatedSelector: state => !state.auth.user || state.auth.invitationCodeRequired,
  wrapperDisplayName: 'UserIsNotAuthenticatedRedirect',
  redirectAction: routerActions.replace
});

const userIsAuthenticated = connectedAuthWrapper({
  authenticatedSelector: state => !!state.auth.user && !state.auth.invitationCodeRequired,
  wrapperDisplayName: 'UserIsAuthenticated'
});

const HeaderWrapper = userIsAuthenticated((props) => <Header {...props} />);

class App extends Component {
  componentDidMount() {
    this.props.checkAuth();
  }

  render() {
    return (
      <ThemeProvider theme={defaultTheme}>
        <ReactBreakpoints breakpoints={breakpoints}>
          <Route exact path="/privacy" component={PrivaryPolicy} />
          <Route exact path="/login" component={userIsNotAuthenticatedRedirect(Login)} />
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />

          <HeaderWrapper />
          <Container>
            <Wrapper>
              <Route exact path="/dashboard" component={userIsAuthenticatedRedirect(Dashboard)} />
              <Route exact path="/profile/:id?" component={userIsAuthenticatedRedirect(Profile)} />
            </Wrapper>
          </Container>
        </ReactBreakpoints>
      </ThemeProvider>
    );
  }
}

export default withRouter(connect(null, { checkAuth })(App));
