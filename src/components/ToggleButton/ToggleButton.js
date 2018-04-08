import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

let active = null;
let inactive = null;

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
      background: ${props => `url(${inactive}) no-repeat`};
      vertical-align: middle;
      background-position: center;
      background-size: contain;
  }

  > input:checked + label:before {
      background: ${props => `url(${active}) no-repeat`};
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

    // Can't load dynamically based on variable, need to use switch case load manually
    switch (this.props.type) {
      case "A":
        active = require('../../img/on.png');
        inactive = require('../../img/off.png');
        break;
      case "B":
        active = require('../../img/switch-on.png');
        inactive = require('../../img/switch-off.png');
        break;
      case "C":
        // active = require('');
        // inactive = require('');
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <Toggle>
        <input type="checkbox" id={this.state.id} />
        <label htmlFor={this.state.id}>{this.props.label}</label>
      </Toggle>
    );
  }
}

ToggleButton.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ToggleButton;
