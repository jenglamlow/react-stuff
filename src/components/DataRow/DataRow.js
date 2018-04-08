import React, { Component } from 'react';
import styled from 'styled-components';

import { RowBaseContainer, RowBase, ColumnBase } from '../RowElement'

const DataRowContainer = RowBaseContainer.extend`
  background-color: pink
`;

const DataRowStyle = RowBase.extend`
  text-align: center;
`;

const LeftDataColumn = ColumnBase.extend`
  width: 100px;
  border-right: 1px solid grey;
`;

const RightDataColumn = ColumnBase.extend`
`;

class DataRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    return (
      <DataRowContainer>
        <DataRowStyle>
          <LeftDataColumn>
            row1
          </LeftDataColumn>
          <RightDataColumn>
            cell1
          </RightDataColumn>
        </DataRowStyle>
      </DataRowContainer>
    );
  }
}

export default DataRow;
