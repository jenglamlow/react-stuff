import styled from 'styled-components';


// Row Base
export const RowBaseContainer = styled.div`
  display: table;
  width: 100%;
`;

export const RowBase = styled.div`
  display: table-row;
`;

export const ColumnBase = styled.div`
  display: table-cell;
  border-bottom: 1px solid grey;
`;

// Data Row
export const DataRowContainer = RowBaseContainer.extend`
  background-color: pink
`;

export const DataRowStyle = RowBase.extend`
  text-align: center;
`;

export const LeftDataColumn = ColumnBase.extend`
  width: 100px;
  border-right: 1px solid grey;
`;

export const RightDataColumn = ColumnBase.extend`
`;

// Header Row
export const HeaderRowContainer = RowBaseContainer.extend`
  background-color: red
`;

export const HeaderRowStyle = RowBase.extend`
  text-align: left;
`;

export const HeaderDataColumn = ColumnBase.extend`
`;

