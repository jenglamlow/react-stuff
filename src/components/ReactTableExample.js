import React, { Component } from 'react';
import ReactTable from 'react-table';
import $ from 'jquery';

import 'react-table/react-table.css';
import './react-table.css';

const data = [{
  name: 'Tanner Linsleyasdddddddddddddddddddddddddddddadasdddddddddddddsasdddddddddddddddddddddddddd',
  age: 26,
  friend: {
    name: 'Jason Maurer',
    age: 23,
  }
}, {
  name: 'Tanner Linsley',
  age: 26,
  friend: {
    name: 'Jason Maurer',
    age: 23,
  }
}, {
  name: 'Tanner Linsley',
  age: 26,
  friend: {
    name: 'Jason Maurer',
    age: 23,
  }
}, {
  name: 'Tanner Linsley',
  age: 26,
  friend: {
    name: 'Jason Maurer',
    age: 23,
  }
}, {
  name: 'Tanner Linsley',
  age: 26,
  friend: {
    name: 'Jason Maurer',
    age: 23,
  }
}, {
  name: 'Tanner Linsley',
  age: 26,
  friend: {
    name: 'Jason Maurer',
    age: 23,
  }
}, {
  name: 'Tanner Linsley',
  age: 26,
  friend: {
    name: 'Jason Maurer',
    age: 23,
  }
}];

const columns = [{
  Header: 'Name',
  accessor: 'name',
  minWidth: 250
}, {
  Header: 'Age',
  accessor: 'age',
  maxWidth: 100,
}, {
  id: 'friendName', 
  Header: 'Friend Name',
  maxWidth: 70,
  accessor: d => d.friend.name 
}, {
  Header: 'Friend Age',
  maxWidth: 70,
  accessor: 'friend.age'
}];

class ReactTableExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: -1
    };
  }

  componentDidMount() {
    $(".rt-tbody").on("scroll", function() {
    });
  }

  render() {
    return (
      <div>
        <ReactTable
          showPagination={false}
          data={data}
          minRows = {0}
          columns={columns}
          // onSortedChange={(c, s) => { document.activeElement.blur(); }}
          className="-highlight"
          style={{
            height: "200px",
            // width: "800px"
          }}
          getTrGroupProps={(params, rowInfo) => {
            let style = {};
            if (rowInfo.index === this.state.highlightedIndex) {
              style = { border: "1px solid lightblue" };
            }
            return {
              style,
              onClick: () => {
                this.setState({ highlightedIndex: rowInfo.index });
              }
            };
          }}
        />
      </div>
    );
  }
}

export default ReactTableExample;