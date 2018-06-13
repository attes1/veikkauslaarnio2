import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signOut } from '../../modules/authentication';
import Section from '../../components/Section';

const Dashboard = (props) => (
  <div>
    <Section>
      <p>MM-kisaveikkaus 2018. Klikkaile tulokset "My picks" -näkymässä. Osallistu vetoon maksamalla ennen group stagen veikkausten sulkeutumista mulle (Atelle) Mobile Paylla 20e. Voi pistää myös tippiä, ylimääräset menee hosting-kustannuksiin / lahjotetaan eteenpäin football-data.org API:n ylläpitäjälle.</p>
      <p>Oikeesta 1x2 tuloksesta 1pts, oikeista maalimääristä 3pts.</p>
      <p>Payout structure: ???</p>
      <p>Devaus on vielä vähän kesken, leaderboardit yms. tulee kunhan kerkeen.</p>
    </Section>
  </div>
);

export default withRouter(connect(null, { signOut })(Dashboard));
