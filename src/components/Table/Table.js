

import React, { Component } from 'react';

import RowData from './DataRow';
import RowHeader from './HeaderRow';


class Table extends Component {
  render() {
    return (
      <div className="Table">
        <RowHeader/>
        <RowData/>
        <RowData/>
        <RowHeader/>
        <RowData/>
        <RowData/>
      </div>
    );
  }
}

export default Table;
