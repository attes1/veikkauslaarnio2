import React from 'react';
import { Route, Link } from 'react-router-dom';
import styledNormalize from 'styled-normalize'
import { injectGlobal, ThemeProvider } from 'styled-components'
import { injectLayoutBaseCSS } from 'styled-bootstrap-grid';
import { requireAuthentication } from '../../components/ProtectedComponent/ProtectedComponent';
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

const App = () => (
  <ThemeProvider theme={defaultTheme}>
    <div>
      <header>
        <Link to="/">Home</Link>
      </header>

      <main>
        <Route exact path="/" component={requireAuthentication(Dashboard)}/>
        <Route exact path="/login" component={Login} />
      </main>
    </div>
  </ThemeProvider>
);

export default App;
