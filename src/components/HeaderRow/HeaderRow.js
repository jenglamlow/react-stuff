import React, { Component } from 'react';
import styled from 'styled-components';

import { HeaderRowContainer, HeaderRowStyle, HeaderDataColumn } from '../RowElement'

class HeaderRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    return (
      <HeaderRowContainer>
        <HeaderRowStyle>
          <HeaderDataColumn>
            Header
          </HeaderDataColumn>
        </HeaderRowStyle>
      </HeaderRowContainer>
    );
  }
}

export default HeaderRow;
