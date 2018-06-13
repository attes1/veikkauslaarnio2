import React from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faChevronUp from '@fortawesome/fontawesome-free-solid/faChevronUp';
import faChevronDown from '@fortawesome/fontawesome-free-solid/faChevronDown';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 1.5rem;
  justify-content: center;
`;

const Stepper = styled.button`
  display: flex;
  border: 0;
  cursor: pointer;
  background: transparent;

  :hover {
    color: ${props => props.theme.lapisZapuli};
  }

  :focus {
    outline: 0;
  }
`;

const Number = styled.span`
  display: flex;
  justify-content: center;
`;

const NumberStepper = ({ number, increment, decrement, disabled }) => (
  <Wrapper>
    {!disabled && <Stepper onClick={increment}>
      <FontAwesomeIcon icon={faChevronUp} />
    </Stepper>}
    <Motion
      key={number}
      defaultStyle={{size: 1.2}}
      style={{size: spring(1, {stiffiness: 60, damping: 10})}}>
      {({size}) => <Number style={{transform: `scale3d(${size}, ${size}, ${size})`}}>{number === null ? 'X' : number}</Number>}
    </Motion>
    {!disabled && <Stepper onClick={decrement}>
      <FontAwesomeIcon icon={faChevronDown} />
    </Stepper>}
  </Wrapper>
);

export default NumberStepper;
