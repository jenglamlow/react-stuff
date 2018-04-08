import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Toggle = styled.div`
  margin-left: 10px;
  user-select: none;
  display: inline-block;

  > input {
      display: none;
  }

  > label {
      font-size: 12px;
  }

  > label:before {
      content: '';
      width: 16px;
      height: 16px;
      display: inline-block;
      text-transform: capitalize;
      margin-right: 5px;
      background: ${props => `url(${props.off}) no-repeat`};
      vertical-align: middle;
      background-position: center;
      background-size: contain;
  }

  > input:checked + label:before {
      background: ${props => `url(${props.on}) no-repeat`};
      background-position: center;
      background-size: contain;
  }

  > input:checked + label {
      color: green
  }
`;

class ToggleButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.label.replace(/ /g, '-')
    };
  }

  render() {
    return (
      <Toggle on={this.props.on} off={this.props.off}>
        <input type="checkbox" id={this.state.id} />
        <label htmlFor={this.state.id}>{this.props.label}</label>
      </Toggle>
    );
  }
}

ToggleButton.propTypes = {
  label: PropTypes.string.isRequired,
  on: PropTypes.string.isRequired,
  off: PropTypes.string.isRequired
};

export default ToggleButton;
