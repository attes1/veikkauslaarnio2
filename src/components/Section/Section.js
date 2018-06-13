import styled from 'styled-components';

const Section = styled.section`
  background: ${props => props.theme.smoke};
  border: 1px solid ${props => props.theme.sterling};
  padding: 1rem;
  border-radius: 4px;
`;

export default Section;
