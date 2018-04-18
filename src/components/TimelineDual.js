import React, { Component } from 'react';
import styled from 'styled-components';
import InputRange from 'react-input-range';
import './react-input-range.css';


const canvasHeight = 30;

const videoLength = 5 * 60 * 1000;
let scale = Math.pow(videoLength/1000, 1/10-0.3);

const canvasStyle = {
  verticalAlign: "bottom"
};

const TimeContainer = styled.div`
  margin: 0;
  padding: 0;
  background:rgb(22,22,22)
`;

const SliderContainer = styled.div`
  padding: 30px;
`;

class TimelineDual extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      min: 1,
      max: 10,
      step: 0.01,
      value: {
        max: 10,
        min: 1,
      },
      last: {
        max: 10,
        min: 1
      }
    };

    this.canvasRef = null;
    this.ctx = null;
    this.windowWidth = document.body.clientWidth;

    // Bind 'this' property into the event handler
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnStart = this.handleOnStart.bind(this);

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
    this.initCanvas();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  //================================================================================
  // Handler
  //================================================================================
  handleResize() {
    const windowWidth = document.body.clientWidth;

    // Only fire redraw when width change
    if (this.windowWidth !== windowWidth) {
      this.redrawCanvas();
      this.windowWidth = windowWidth;
    }
  }

  handleClick(e) {
    const rect = this.canvasRef.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    console.log("x coords: " + x + ", y coords: " + y);
  }

  handleOnStart(data){
    // console.log('start', data);
  }

  handleOnChange(value) {
    const last = this.state.last;
    const from = value.min.toFixed(2);
    const to = value.max.toFixed(2);
    const diff = (to - from).toFixed(2);

    // Prevent value exceed limit (bug in slider library)
    if ((value.min < this.state.min) || (value.max > this.state.max)) {
      return;
    }

    console.log(to, from, diff);
    // Keep a minimum gap in the range
    if (diff < 0.3) {
      return;
    }
    
    scale = Math.pow(videoLength/1000, 1/diff);
    
    this.setState({value: value});

    //this.redrawCanvas();
  }

  //================================================================================
  // Helper Functions
  //================================================================================

  msToTimecode(d, fps) {
    // convert milliseconds to seconds
    let seconds = d / 1000;
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds = Math.floor(seconds - minutes * 60 - hours * 3600);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    // frames = (frames < 10) ? "0" + frames : frames;
    let frames = "00";
  
    // Temporary hardcode the frame to 00
    return hours + ":" + minutes + ":" + seconds + ":" + frames;
  }

  redrawCanvas() {
    let length = this.canvasRef.parentNode.clientWidth;

    // Callback method to ensure that the canvas is drawn during initialization
    this.setState({ width: length }, () => {
      // show canvas
      this.canvasRef.style.display = "";
      this.ctx.clearRect(0, 0, length, canvasHeight);

      this.drawTimeScale(videoLength, length);
      
    });
  }
    
  drawTimeScale(duration, length) {
    const steps = duration/scale;
    
    // units
    const P0 = 100;
    const R = (scale * P0) % P0;
    const units = R + P0;  // pixel position
    
    let count = length / units;
    console.log(steps, scale);

    // Draw Label and scale
    for (let i = 0; i < count; i++)
    {
      let t = (i * steps);
      let labelPos = (i * units);
      this.drawBar({
        type: 'label',
        x: labelPos,
        text: this.msToTimecode(t)
      });
      let minorMarker = units/10;
      for (let j = 0; j < 10; j++) {
        let minorPos = (j * minorMarker) + labelPos;
        if (j !== 5) {
          this.drawBar({
            type: 'minor',
            x: minorPos,
          });
        } else {
          this.drawBar({
            type: 'major',
            x: minorPos,
          });
        }
      }
    }
  }

  initCanvas() {
    let length = this.canvasRef.parentNode.clientWidth;

    // Callback method to ensure that the canvas is drawn during initialization
    this.setState({ width: length }, () => {
      // show canvas
      this.canvasRef.style.display = "";
      this.ctx.clearRect(0, 0, length, canvasHeight);

      this.drawTimeScale(videoLength, length);
    });
  }

  writeText(text, x, y) {
    this.ctx.font = "11px Arial";
    this.ctx.fillStyle = "#808080";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text ,x, y);
  }

  drawBar(data) {
    let barHeight = 7;
    if (data.type === 'label') {
      barHeight = 15;
    } else if (data.type === 'major') {
      barHeight = 12;
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

  render() {
    return (
      <div>
        <TimeContainer>
          <canvas ref={this.setCanvasRef} 
                  style={canvasStyle} 
                  height={canvasHeight} 
                  width={this.state.width} 
                  onClick={this.handleClick}></canvas>
        </TimeContainer>
        <br/>
        <SliderContainer>
          <InputRange
            draggableTrack
            formatLabel={value => value.toFixed(1)}
            step={this.state.step}
            maxValue={this.state.max}
            minValue={this.state.min}
            onChange={this.handleOnChange}
            value={this.state.value} />
        </SliderContainer>
      </div>
      
    );
  }
}


export default TimelineDual;
