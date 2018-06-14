import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { media } from 'styled-bootstrap-grid';
import { increment, decrement } from '../../modules/profile';
import Section from '../Section';
import NumberStepper from '../NumberStepper';

const Box = Section.extend`
  display: flex;
  margin-bottom: 12px;
  font-size: 0.8rem;
  padding: 0.5rem;
`;

const Crest = styled.img`
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  max-width: 1.6rem;
  max-height: 1.2rem;
`;

const AwayTeam = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 50%;
`;

const HomeTeam = AwayTeam.extend`
  justify-content: flex-end;

  strong {
    text-align: right;
  }
`;

const TeamTitle = styled.div`
  display: flex;
  align-items: center;
`;

const TBA = styled.strong`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const Fixture = ({ info, home, away, bet, increment, decrement, isKipecheMode }) => (
  <Fragment>
    {home && away ?
      <Box>
        <HomeTeam>
          <TeamTitle>
            <strong>{home.name}</strong>
            <Crest src={home.crestUrl} />
          </TeamTitle>
          <NumberStepper increment={() => increment(info.id, 'goalsHomeTeam', isKipecheMode)} decrement={() => decrement(info.id, 'goalsHomeTeam', isKipecheMode)} number={bet.goalsHomeTeam} disabled={false} />
        </HomeTeam>
        <AwayTeam>
          <NumberStepper increment={() => increment(info.id, 'goalsAwayTeam', isKipecheMode)} decrement={() => decrement(info.id, 'goalsAwayTeam', isKipecheMode)} number={bet.goalsAwayTeam} disabled={false} />
          <TeamTitle>
            <Crest src={away.crestUrl} />
            <strong>{away.name}</strong>
          </TeamTitle>
        </AwayTeam>
      </Box> :
      <Box>
        <HomeTeam>
          <TBA>TBA</TBA>
        </HomeTeam>
        <AwayTeam>
          <TBA>TBA</TBA>
        </AwayTeam>
      </Box>
    }
  </Fragment>
);

export default connect(null, { increment, decrement })(Fixture);
