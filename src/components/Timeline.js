import React, { Component } from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider'; 

const canvasHeight = 30;
// Slider

const slider = {
    min: -1,
    max: 1,
    value: 0,
    step: 0.01
};

let time_scale = 1;
let videoLength = 2 * 60 * 1000;
////

const canvasStyle = {
  verticalAlign: "bottom"
};

const TimeContainer = styled.div`
  margin: 0;
  padding: 0;
  background:rgb(22,22,22)
`;

const SliderContainer = styled.div`
  padding: 10px;
`;

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      min: 0,
      max: 100,
      value: {
        max: 100,
        min: 0,
      },
    };

    this.canvasRef = null;
    this.ctx = null;
    this.windowWidth = document.body.clientWidth;

    // Bind 'this' property into the event handler
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSlider = this.handleSlider.bind(this);

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

  handleSlider(value) {
    // 2 = 2 seconds reso
    // 4 - quotient
    const base = Math.ceil(Math.log2(videoLength/(2000 * 4)));
    time_scale = Math.pow(base, value);
    this.redrawCanvas();
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
    // time scale [0.01 - 100]
    // units = distance between marker (pixels)
    const K = 100;
    
    const Q = Math.floor(time_scale);
    const R = (time_scale * K)  % K;
    
    const units = R + K;  // pixel position
    
    let count = length / units;
    let steps = duration / (4 * Math.pow(2, Q)); //label

    // steps = Math.pow(2, Math.ceil(Math.log10(steps)/Math.log10(2)));
    // screen_count = Math.pow(2, Math.ceil(Math.log10(screen_count)/Math.log10(2)));

    steps = Math.pow(2, Math.ceil(Math.log2(steps)));
    count = Math.pow(2, Math.ceil(Math.log2(count)));

    // console.log( steps, Q);

    // Draw Line
    this.drawLine(duration/steps * units);

    // Draw Label and scale
    for (let i = 0; i < count; i++)
    {
      let t = (i * steps);
      let labelPos = i * units;
      this.drawBar({
        type: 'label',
        x: labelPos,
        text: this.msToTimecode(t)
      });
      let minorMarker = units/10;
      for (let j = 1; j < 10; j++) {
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
          <Slider min={slider.min} max={slider.max} defaultValue={slider.value} step={slider.step} onChange={this.handleSlider} onBeforeChange={this.handleOnStart}></Slider>
        </SliderContainer>
      </div>
      
    );
  }
}


export default Timeline;
