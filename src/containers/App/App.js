import React from 'react';
import { Route, Link } from 'react-router-dom';
import styledNormalize from 'styled-normalize'
import { injectGlobal } from 'styled-components'

injectGlobal`
  ${styledNormalize}

  @import url('https://fonts.googleapis.com/css?family=Fjalla+One');
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700,700i');

  body {
    font-family: 'Noto Sans', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Fjalla One', sans-serif;
  }
`

const App = () => (
  <div>
    <header>
      <Link to="/">Home</Link>
    </header>

    <main>
      <Route exact path="/" render={() => (<h1>Veikkauslaarnio</h1>)} />
    </main>
  </div>
);

export default App;
