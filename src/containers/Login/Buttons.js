import styled from 'styled-components';
import FacebookLogo from '../../assets/facebook.svg';
import GoogleLogo from '../../assets/google.svg';

const Shared = styled.button`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  white-space: nowrap;
  font-size: 0.8rem;
  cursor: pointer;
  height: 3rem;
  padding: 0.5rem;
  font-weight: bold;
  background: #ffffff;
  margin: 0.5rem 0;

  :before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    width: 2rem;
    height: 2rem
  }
`;

export const FacebookLoginButton = Shared.extend`
  border: 1px solid #4267B2;
  box-shadow: 1px 1px 2px -1px rgba(0,0,66,1);

  :before {
    background: url(${FacebookLogo}) no-repeat;
  }
`;

export const GoogleLoginButton = Shared.extend`
  border: 1px solid #DD4B39;
  box-shadow: 1px 1px 2px -1px rgba(221,75,57,1);

  :before {
    background: url(${GoogleLogo}) no-repeat;
    height: 3rem;
    width: 3rem;
    top: 0.1rem;
    left: 0.1rem;
  }
`;
