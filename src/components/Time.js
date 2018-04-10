import React, { Component } from 'react';
import styled from 'styled-components';

const canvasHeight = 30;
const canvasWidthOffset = 182;
const canvasStyle = {
  verticalAlign: "bottom"
};

const TimeContainer = styled.div`
  margin: 0;
  padding: 0;
  background:rgb(22,22,22)
`;

class Time extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth - canvasWidthOffset
    };

    this.canvasRef = null;
    this.ctx = null;

    // Bind 'this' property into the event handler
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.redrawCanvas = this.redrawCanvas.bind(this);

    // Callback to bind the DOM ref
    this.setCanvasRef = dom => {
      this.canvasRef = dom;
    };
  }

  
  //================================================================================
  // React Lifecycle
  //================================================================================
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.ctx = this.canvasRef.getContext('2d');
    this.redrawCanvas();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  //================================================================================
  // Handler
  //================================================================================
  handleResize() {
    this.redrawCanvas();
  }

  handleClick(e) {
    const rect = this.canvasRef.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    console.log("x coords: " + x + ", y coords: " + y);
  }

  //================================================================================
  // Helper Functions
  //================================================================================

  redrawCanvas() {
    let length = window.innerWidth - canvasWidthOffset;
    this.setState({width: length});
    this.writeText(length.toString(), 100, 10);
  }

  writeText(text, x, y) {
    this.ctx.font = "11px Arial";
    this.ctx.fillStyle = "#808080";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text ,x, y);
  }

  render() {
    return (
      <TimeContainer>
        <canvas ref={this.setCanvasRef} 
                style={canvasStyle} 
                height={canvasHeight} 
                width={this.state.width} 
                onClick={this.handleClick}></canvas>
      </TimeContainer>
    );
  }
}


export default Time;
