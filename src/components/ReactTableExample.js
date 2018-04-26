import React, { Component } from 'react';
import styled from 'styled-components';
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
  accessor: 'name' // String-based value accessors!
}, {
  Header: 'Age',
  accessor: 'age',
  Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
}, {
  id: 'friendName', // Required because our accessor is not a string
  Header: 'Friend Name',
  accessor: d => d.friend.name // Custom value accessors!
}, {
  Header: props => <span>Friend Age</span>, // Custom header components!
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
      console.log('hey hey hey');
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
            width: "800px"
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