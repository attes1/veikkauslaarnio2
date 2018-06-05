import React, { Component, Fragment } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styledNormalize from 'styled-normalize'
import styled, { injectGlobal, ThemeProvider } from 'styled-components'
import { injectLayoutBaseCSS } from 'styled-bootstrap-grid';
import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { routerActions } from 'react-router-redux'
import { checkAuth } from '../../modules/authentication';
import Login from '../Login';
import Dashboard from '../Dashboard';

const defaultTheme = {
  jetBlack: '#131516',
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
  padding: 1rem;
`;

const userIsAuthenticated = connectedReduxRedirect({
 redirectPath: '/login',
 authenticatedSelector: state => !!state.auth.user,
 wrapperDisplayName: 'UserIsAuthenticated',
 redirectAction: routerActions.replace
});

const locationHelper = locationHelperBuilder({});
const userIsNotAuthenticated = connectedReduxRedirect({
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/dashboard',
  allowRedirectBack: false,
  authenticatedSelector: state => !state.auth.user,
  wrapperDisplayName: 'UserIsNotAuthenticated',
  redirectAction: routerActions.replace
});

class App extends Component {
  componentDidMount() {
    this.props.checkAuth();
  }

  render() {
    return (
      <ThemeProvider theme={defaultTheme}>
        <Fragment>
          <Route exact path="/login" component={userIsNotAuthenticated(Login)} />
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />

          <Wrapper>
            <Route exact path="/dashboard" component={userIsAuthenticated(Dashboard)} />
          </Wrapper>
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default withRouter(connect(null, { checkAuth })(App));
