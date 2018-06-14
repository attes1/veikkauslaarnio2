import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'styled-bootstrap-grid';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moneyBillAlt from '@fortawesome/fontawesome-free-solid/faMoneyBillAlt';
import { push } from 'react-router-redux';
import { getProfiles } from '../../modules/leaderboard';
import { getFixtures, getLockDates } from '../../modules/competition';

const LeaderboardRow = styled.div`
  cursor: pointer;
  padding: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.darkLiver};
  font-size: 0.8rem;

  :hover {
    color: ${props => props.theme.lapisZapuli};
    background: ${props => props.theme.smoke};
  }
`;

const PaymentApproved = styled.span`
  color: ${props => props.theme.greenSheen};
  margin-left: 1rem;
`;

const Points = styled.div`
  text-align: right;
`;

class Leaderboard extends Component {
  componentDidMount() {
    this.props.getFixtures()
      .then(() => {
        this.props.getProfiles();
      });
  }

  render() {
    const { profiles, isLoadingProfiles } = this.props;

    if (!isLoadingProfiles) {
      return (
        <div>
          <h1>Leaderboard</h1>

          {profiles.sort((a, b) => b.points - a.points).map((profile, index) => (
            <LeaderboardRow key={profile.id} onClick={() => this.props.push(`/profile/${profile.id}`)}>
              <Row>
                <Col sm={1}>
                  <span>{index + 1}.</span>
                </Col>
                <Col sm={9}>
                  <strong>
                    {profile.displayName}
                    {profile.paymentFulfilled &&
                      <PaymentApproved>
                        <FontAwesomeIcon title="Payment approved" icon={moneyBillAlt} />
                      </PaymentApproved>
                    }
                  </strong>
                </Col>
                <Col sm={2}>
                  <Points>{profile.points}pts</Points>
                </Col>
              </Row>
            </LeaderboardRow>
          ))}
        </div>
      );
    } else {
      return (
        <strong>Loading...</strong>
      );
    }
  }
}

const mapStateToProps = state => ({
  profiles: state.leaderboard.profiles,
  isLoadingProfiles: state.leaderboard.isLoadingProfiles
});

export default withRouter(connect(mapStateToProps, { getProfiles, getFixtures, getLockDates, push })(Leaderboard));
