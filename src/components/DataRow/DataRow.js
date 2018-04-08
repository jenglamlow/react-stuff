import React, { Component } from 'react';
import styled from 'styled-components';

import { DataRowContainer, DataRowStyle, LeftDataColumn, RightDataColumn } from '../RowElement'

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
