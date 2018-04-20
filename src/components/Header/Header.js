import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// The Header creates links that can be used to navigate
// between routes.

const HeaderComponent = ({className})  => (
  <header className={className}>
    <Link to='/'>Home</Link>
    <Link to='/table'>Table</Link>
    <Link to='/button'>Button</Link>
    <Link to='/timeline'>Timeline</Link>
    <Link to='/timelinedual'>TimelineDual</Link>
    <Link to='/d3'>D3</Link>
  </header>
);

const Header = styled(HeaderComponent)`
  margin: 15px 
`;


export default Header;
