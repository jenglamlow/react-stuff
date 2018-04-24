

import React, { Component } from 'react';

import RowData from './DataRow';
import RowHeader from './HeaderRow';

import './Table.css';
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
        <div class="table-container">
          <table>
              <thead>
                  <tr>
                      <th>head1</th>
                      <th>head2</th>
                      <th>head3</th>
                      <th>head4</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>content1</td>
                      <td>content2</td>
                      <td>content3</td>
                      <td>content4</td>
                  </tr>
                  <tr>
                      <td>content1</td>
                      <td>content2</td>
                      <td>content3</td>
                      <td>content4</td>
                  </tr>
                  <tr>
                      <td>content1</td>
                      <td>content2</td>
                      <td>content3</td>
                      <td>content4</td>
                  </tr>
                  <tr>
                      <td>content1</td>
                      <td>content2</td>
                      <td>content3</td>
                      <td>content4</td>
                  </tr>
                  <tr>
                      <td>content1</td>
                      <td>content2</td>
                      <td>content3</td>
                      <td>content4</td>
                  </tr>
                  <tr>
                      <td>content1</td>
                      <td>content2</td>
                      <td>content3</td>
                      <td>content4</td>
                  </tr>
              </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Table;
