import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import imgSample from '../../img/expand-collapse.png';
import downloadLogo from '../../img/Download.png';

const StyledPopUp = styled.div`
  border: 1px solid grey;
  display: inline-block;
  padding: 5px;
  margin-left: 300px;
  cursor: pointer;
  user-select: none;
  position: relative
`;

const DropDownMenuText = styled.div`
  color: grey;

  &:before {
    background: url(${imgSample}) no-repeat;
    background-size: contain;
    background-position: 0% 30%;
    width: 12px;
    height: 14px;
    content: "";
    float: left;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  background-color: lightblue;
  height: 2px;
  position: absolute;
  top: 22px;
  left: 0px
`;

const DownloadMenu = styled.div`
  background-color: black;
  position: absolute;
  border: 1px solid grey;
  height: 500px;
  width: 300px
  top: 85px;
  left: 128px
`;

class PopUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event){
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu(event) {
    
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });  
      
    }
  }

  render() {
    return (
      <div>
        <StyledPopUp onClick={this.showMenu}>
          <DropDownMenuText>
            Download Selected
          </DropDownMenuText>
          {this.state.showMenu ? null : (<ProgressBar></ProgressBar>)}
        </StyledPopUp>
        {
          this.state.showMenu
            ? (
              <DownloadMenu
                innerRef={(element) => {
                  this.dropdownMenu = element;
                }}
              >
              </DownloadMenu>
            )
            : (
              null
            )
        }
      </div>

    );
  }
}

export default PopUp;
