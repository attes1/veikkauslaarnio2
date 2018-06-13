import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Row, Col, media } from 'styled-bootstrap-grid';
import { isAfter } from 'date-fns';
import { increment, decrement } from '../../modules/profile';
import Section from '../Section';
import NumberStepper from '../NumberStepper';

const Box = Section.extend`
  margin-bottom: 1rem;
  font-size: 0.75rem;
  padding: 0.5rem;
`;

const Crest = styled.img`
  width: 1.2rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
`;

const AwayTeam = styled.strong`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${media.md`
    justify-content: flex-start;
    margin-left: -15px;
  `}
`;

const HomeTeam = AwayTeam.extend`
  flex-direction: row-reverse;
  justify-content: flex-end;

  ${media.md`
    flex-direction: row;
    justify-content: flex-end;
    margin-right: -15px;
  `}
`;

const TBA = styled.span`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const Fixture = ({ info, home, away, bet, increment, decrement, isKipecheMode }) => {
  return (
  <Box>
    {home && away ?
      <Row>
        <Col sm={6} noGutter={true}>
          <HomeTeam>
            {home.name}
            <Crest src={home.crestUrl} />
            <NumberStepper increment={() => increment(info.id, 'goalsHomeTeam', isKipecheMode)} decrement={() => decrement(info.id, 'goalsHomeTeam', isKipecheMode)} number={bet.goalsHomeTeam} />
          </HomeTeam>
        </Col>
        <Col sm={6}>
          <AwayTeam>
            <NumberStepper increment={() => increment(info.id, 'goalsAwayTeam', isKipecheMode)} decrement={() => decrement(info.id, 'goalsAwayTeam', isKipecheMode)} number={bet.goalsAwayTeam} disabled={isAfter(info.lockDate, new Date())} />
            <Crest src={away.crestUrl} />
            {away.name}
          </AwayTeam>
        </Col>
      </Row> :
      <Row>
        <Col sm={6}>
          <HomeTeam>
            <TBA>TBA</TBA>
          </HomeTeam>
        </Col>
        <Col sm={6}>
          <AwayTeam>
            <TBA>TBA</TBA>
          </AwayTeam>
        </Col>
      </Row>
    }
  </Box>
)};

export default connect(null, { increment, decrement })(Fixture);
