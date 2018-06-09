import React, { Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom';
import { Container, Row, Col, media } from 'styled-bootstrap-grid';
import { TransitionMotion, spring, presets } from 'react-motion';
import { withBreakpoints } from 'react-breakpoints';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faEllipsisV from '@fortawesome/fontawesome-free-solid/faEllipsisV';
import { signOut } from '../../modules/authentication';
import { showNavigation, hideNavigation } from '../../modules/common';

const Wrapper = styled.nav`
  position: sticky;
  width: 100%;
  min-height: 48px;
  background: ${props => props.theme.lapisZapuli};
  border-bottom: 1px solid ${props => props.theme.darkLiver};
  box-shadow: 0 1px 2px 1px ${props => props.theme.sterling};
  user-select: none;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  height: 48px;
  margin: 0;
  color: ${props => props.theme.smoke};
  text-transform: uppercase;
`;

const List = styled.ul`
  display: flex;
  margin: 0;

  flex-direction: column;
  justify-content: flex-start;
  padding: 0;
  height: auto;

  ${media.lg`
    flex-direction: row;
    justify-content: flex-end;
    height: 48px;
  `}
`;

const ListItem = styled.li`
  display: flex;
  list-style: none;

  a {
    display: flex;
    height: 100%;
    width: 100%;
    padding: 0 0.5rem;
    align-items: center;
    color: ${props => props.theme.smoke};
    font-weight: bold;
    font-size: 0.8rem;
    text-decoration: none;
    transition: color ease-out 0.5s;

    :hover {
      color: ${props => props.theme.mustard};
    }
  }
`;

const SignOutLink = styled.a`
  display: flex;
  cursor: pointer;
`;

const OpenMenuButton = styled.a`
  position: absolute;
  right: 0;
  top: 1rem;
  padding: 0 1rem;
  color: ${props => props.theme.smoke};
  cursor: pointer;
`;

const CloseMenuButton = OpenMenuButton.extend`
  color: ${props => props.theme.mustard};
`;

const menuItems = [
  { data: { Component: Link, to: 'dashboard', text: 'Dashboard' }, key: 'dashboard' },
  { data: { Component: Link, to: 'predictions', text: 'Predictions' }, key: 'predictions' },
  { data: { Component: Link, to: 'leaderboard', text: 'Leaderboard' }, key: 'leaderboard' },
  { data: { Component: SignOutLink, text: 'Sign out' }, key: 'signOut' },
];

const getDefaultStyles = () => {
  return menuItems.map(item => ({ ...item, style: { height: 0, opacity: 1 } }));
};

const getStyles = () => {
  return menuItems.map(item => ({
    ...item,
    style: {
      height: spring(48, presets.wobbly),
      opacity: spring(1, presets.wobbly)
    }
  }));
};

const willEnter = () => {
  return {
    height: 0,
    opacity: 1
  };
};

const willLeave = () => {
  return {
    height: spring(0),
    opacity: spring(0)
  };
};

const Header = ({ user, isNavigationVisible, signOut, showNavigation, hideNavigation, screenWidth, breakpoints }) => (
  <Wrapper>
    <Container>
      <Row alignItems="center">
        <Col lg={4} md={12} sm={12}>
          <Title>
            Veikkauslaarnio
          </Title>

          {screenWidth < breakpoints.lg &&
            <Fragment>
              {isNavigationVisible ?
                <CloseMenuButton onClick={hideNavigation}>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </CloseMenuButton> :
                <OpenMenuButton onClick={showNavigation}>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </OpenMenuButton>
              }
            </Fragment>
          }
        </Col>
        <Col lg={8} md={12} sm={12}>
          {(isNavigationVisible || screenWidth >= breakpoints.lg) &&
            <TransitionMotion
              defaultStyles={getDefaultStyles()}
              styles={getStyles()}
              willLeave={willLeave}
              willEnter={willEnter}>
              {styles =>
                <List>
                  {styles.map(item =>
                    <ListItem key={item.key}>
                      {item.key !== 'signOut' ?
                        <item.data.Component style={item.style} to={item.data.to}>
                          {item.data.text}
                        </item.data.Component> :
                        <item.data.Component style={item.style} onClick={signOut}>
                          {item.data.text}
                        </item.data.Component>
                      }
                    </ListItem>
                  )}
                </List>
              }
            </TransitionMotion>
          }
        </Col>
      </Row>
    </Container>
  </Wrapper>
);

const mapStateToProps = state => ({
  user: state.auth.user,
  isNavigationVisible: state.common.isNavigationVisible
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ signOut }, dispatch),
  showNavigation: () => dispatch(showNavigation()),
  hideNavigation: () => dispatch(hideNavigation())
});

export default withBreakpoints(connect(mapStateToProps, mapDispatchToProps)(Header));
