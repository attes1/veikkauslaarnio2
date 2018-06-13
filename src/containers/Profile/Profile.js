import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { format, compareAsc } from 'date-fns';
import { Row, Col } from 'styled-bootstrap-grid';
import styled from 'styled-components';
import queryString from 'query-string';
import { getProfile } from '../../modules/profile';
import { getFixtures, getTeams, getLockDates } from '../../modules/competition';
import Fixture from '../../components/Fixture';

const matchdays = {
  groupStage: 'Group stage',
  roundOf16: 'Round of 16',
  quarterfinals: 'Quarterfinals',
  semifinals: 'Semifinals',
  thirdPlace: 'Third place',
  final: 'Final'
};

const Title = styled.h1`
  margin: 0.5rem;
`;

const FixtureGroupTitle = styled.h2`
  margin-bottom: 0;
`;

const BettingLock = styled.span`
  display: block;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
`;

class Profile extends Component {
  componentDidMount() {
    this.props.getProfile(this.props.match.params.id);
    this.props.getLockDates();
    this.props.getFixtures();
    this.props.getTeams();
  }

  render() {
    const { profile, bets, fixtures, teams, lockDates, query } = this.props;
    const isKipecheMode = profile.displayName === 'Kimmo Heikkilä' || queryString.parse(query).kipeche_mode === 'true';
    const fixtureCompare = isKipecheMode ? () => Math.floor((Math.random() * 2) - 1) : (a, b) => compareAsc(a.date, b.date);

    const fixturesByMatchDay = _(fixtures)
      .values()
      .map(fixt => {
        switch (fixt.matchday) {
          case 1:
          case 2:
          case 3:
            fixt.matchdayKey = 'groupStage';
            break;
          case 4:
            fixt.matchdayKey = 'roundOf16';
            break;
          case 5:
            fixt.matchdayKey = 'quarterfinals';
            break;
          case 6:
            fixt.matchdayKey = 'semifinals';
            break;
          case 7:
            fixt.matchdayKey = 'thirdPlace';
            break;
          case 8:
            fixt.matchdayKey = 'final';
            break;
          default:
            fixt.matchdayKey = 'groupStage';
            break;
        }

        return fixt;
      })
      .groupBy('matchdayKey')
      .value();

    if (!this.props.isLoadingCompetitionData && !this.props.isLoadingProfile) {
      return (
        <div>
          <Row>
            <Col auto>
              <img src={profile.photoUrl} alt="Profile" />
            </Col>
            <Col auto>
              <Title>
                {profile.displayName}
              </Title>
            </Col>
          </Row>

          {_.map(fixturesByMatchDay, (value, key) => (
            <Fragment key={key}>
              <FixtureGroupTitle>
                {matchdays[key]}
              </FixtureGroupTitle>
              <BettingLock>Betting ends {format(lockDates[key], 'dd.M.YYYY HH:mm')}</BettingLock>

              <Row>
                {value.sort(fixtureCompare).map(fixt => (
                  <Col key={fixt.id} sm={12} md={6} lg={4}>
                    <Fixture info={fixt} home={teams[fixt.homeTeam]} away={teams[fixt.awayTeam]} bet={bets[fixt.id]} isKipecheMode={isKipecheMode} />
                  </Col>
                ))}
              </Row>
            </Fragment>
          ))}
        </div>
      );
    } else {
      return (
        <strong>Loading...</strong>
      )
    }
  }
}

const mapStateToProps = state => ({
  profile: state.profile.info,
  bets: state.profile.bets,
  fixtures: state.competition.fixtures,
  teams: state.competition.teams,
  lockDates: state.competition.lockDates,
  isLoadingCompetitionData: state.competition.isLoadingLockDates || state.competition.isLoadingFixtures || state.competition.isLoadingTeams,
  isLoadingProfile: state.profile.isLoadingProfile,
  query: state.router.location.search
});

export default withRouter(connect(mapStateToProps, { getProfile, getFixtures, getTeams, getLockDates })(Profile));
