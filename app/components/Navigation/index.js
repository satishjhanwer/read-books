/**
 *
 * Navbar
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';

import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    const stateObj = this.state;
    stateObj.isOpen = !stateObj.isOpen;
    this.setState(stateObj);
  }

  render() {
    const { isOpen } = this.state;
    return (
      <React.Fragment>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">
            <FormattedMessage {...messages.header} />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/">
                  <FormattedMessage {...messages.search} />
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default Navigation;
