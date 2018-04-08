import React, { Component } from 'react';

import { RowBaseContainer, RowBase, ColumnBase } from '../RowElement'

// Header Row
const HeaderRowContainer = RowBaseContainer.extend`
  background-color: red
`;

const HeaderRowStyle = RowBase.extend`
  text-align: left;
`;

const HeaderDataColumn = ColumnBase.extend`
`;

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
