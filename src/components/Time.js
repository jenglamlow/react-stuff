import React, { Component } from 'react';
import styled from 'styled-components';

const canvasHeight = 30;
const canvasWidthOffset = 0;
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

  msToTimecode(duration, fps) {
    let frames = parseInt((duration/1000 * fps) % fps, 10);
    let seconds = parseInt((duration/1000)%60, 10);
    let minutes = parseInt((duration/(1000*60))%60, 10);
    let hours = parseInt((duration/(1000*60*60))%24, 10);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    frames = (frames < 10) ? "0" + frames : frames;
  
    // Temporary hardcode the frame to 00
    return hours + ":" + minutes + ":" + seconds + ":00";
  }

  redrawCanvas() {
    let length = window.innerWidth - canvasWidthOffset;
    this.setState({width: length});
    // this.writeText(length.toString(), 100, 10);
    this.drawLine(length);
    var majorNum = parseInt(length/75, 10) + 1;

    for (let i = 0; i < majorNum; i++) {
      this.drawScale(i*75, this.msToTimecode(10000 * (i/majorNum), 30), 15, 5);
    }
  }

  writeText(text, x, y) {
    this.ctx.font = "11px Arial";
    this.ctx.fillStyle = "#808080";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text ,x, y);
  }

  drawBar(data) {
    let barHeight = 7;
    if (data.type === 'major') {
      barHeight = 15;
    }
    const y0 = canvasHeight - 2;
    const y1 = y0 - barHeight;
    const x0 = data.x + 0.5;
  
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "#808080";
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x0, y1);
    this.ctx.stroke();
  
    if ('text' in data) {
      this.writeText(data.text, data.x, y1 - 2);
    }
  }

  drawLine(length) {
    const y = canvasHeight;
    this.ctx.strokeStyle = "#f0f000";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(length, y);
    this.ctx.stroke();
  }

  drawScale(from, text, step, stepSize) {
    this.drawBar({
      type: 'major',
      x: from,
      text: text
    });
  
    for (let i = 1; i < step; i++) {
      this.drawBar({
        type: 'minor',
        x: from + stepSize * i
      });
    }
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
