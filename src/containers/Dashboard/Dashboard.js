import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signOut } from '../../modules/authentication';
import Section from '../../components/Section';

const Info = Section.extend`
  font-size: 0.9rem;
`;

const Dashboard = (props) => (
  <div>
    <Info>
      <h3>
        Mikä?
      </h3>
      <p>
        MM-kisaveikkaus 2018. Klikkaile tulokset "My picks" -näkymässä. Osallistu vetoon maksamalla ennen group stagen veikkausten sulkeutumista mulle (Atelle) Mobile Paylla 20e. Voi pistää myös tippiä, ylimääräset menee hosting-kustannuksiin / lahjotetaan eteenpäin football-data.org API:n ylläpitäjälle.
      </p>

      <h3>
        Säännöt
      </h3>
      <p>
        <strong>Lohkovaihe:</strong><br />
        Oikeesta 1x2 tuloksesta 1pts, oikeista maalimääristä 2pts.<br />
        <strong>Loput:</strong><br />
        Oikeesta 1x2 tuloksesta 2pts, oikeista maalimääristä 2pts.
      </p>

      <h3>
        Payout structure
      </h3>
      <p>
        <ol>
          <li>1. 216e</li>
          <li>2. 108e</li>
          <li>3. 36e</li>
        </ol>
      </p>

      <h3>
        Muuta
      </h3>
      <p>Lisää featureita tulossa sitä tahtia kun kerkeen koodata</p>
    </Info>
  </div>
);

export default withRouter(connect(null, { signOut })(Dashboard));
