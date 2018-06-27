import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import { increment, decrement } from '../../modules/profile';
import Section from '../Section';
import NumberStepper from '../NumberStepper';

const Box = Section.extend`
  margin-bottom: 12px;
  font-size: 0.8rem;
  padding: 0.5rem;
`;

const MatchUp = styled.div`
  display: flex;
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

const Result = styled.div`
  text-align: center;
  margin-top: 0.5rem;
`;

const Separator = styled.div`
  font-size: 1.2rem;
  margin: 0 0.5rem;
`;

const Status = styled.strong`
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  font-size: 0.7rem;
  color: ${props => props.theme.greenSheen};
  transform: rotateZ(-33deg);
`;

const Fixture = ({ info, home, away, bet, increment, decrement, isKipecheMode }) => {
  const result = info.result.goalsHomeTeam !== null && info.result.goalsAwayTeam !== null ? info.result : null;

  return (
    <Fragment>
      {home && away ?
        <Box>
          {info.status === 'IN_PLAY' && <Status>LIVE</Status>}
          <MatchUp>
            <HomeTeam>
              <TeamTitle>
                <strong>{home.name}</strong>
                <Crest src={home.crestUrl} />
              </TeamTitle>
              <NumberStepper increment={() => increment(info.id, 'goalsHomeTeam', isKipecheMode)} decrement={() => decrement(info.id, 'goalsHomeTeam', isKipecheMode)} number={_.get(bet, 'goalsHomeTeam')} disabled={!bet || bet.locked} />
            </HomeTeam>
            {(!bet || bet.locked) && <Separator><strong>-</strong></Separator>}
            <AwayTeam>
              <NumberStepper increment={() => increment(info.id, 'goalsAwayTeam', isKipecheMode)} decrement={() => decrement(info.id, 'goalsAwayTeam', isKipecheMode)} number={_.get(bet, 'goalsAwayTeam')} disabled={!bet || bet.locked} />
              <TeamTitle>
                <Crest src={away.crestUrl} />
                <strong>{away.name}</strong>
              </TeamTitle>
            </AwayTeam>
          </MatchUp>
          {(bet && bet.locked) &&
            <Fragment>
              {result ?
                <Result>
                  <strong>Result: </strong>
                  <strong>{result.goalsHomeTeam} - {result.goalsAwayTeam}</strong>
                  {result.extraTime && <span>({result.extraTime.goalsHomeTeam} - {result.extraTime.goalsAwayTeam})</span>}
                  {result.penaltyShootout && <span>({result.extraTime.goalsHomeTeam} - {result.extraTime.goalsAwayTeam})</span>}
                </Result> :
                <Result>
                  <strong>Result: </strong>
                  <strong>? - ?</strong>
                </Result>
              }
            </Fragment>
          }
        </Box> :
        <Box>
          <MatchUp>
            <HomeTeam>
              <TeamTitle>
                <strong>TBA</strong>
              </TeamTitle>
            </HomeTeam>
            <Separator><strong>-</strong></Separator>
            <AwayTeam>
              <TeamTitle>
                <strong>TBA</strong>
              </TeamTitle>
            </AwayTeam>
          </MatchUp>
        </Box>
      }
    </Fragment>
  );
};

export default connect(null, { increment, decrement })(Fixture);
