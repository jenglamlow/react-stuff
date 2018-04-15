import React, { Component } from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const canvasHeight = 30;
const minStepSize = 5;
const maxStepSize = 20;
const initialMajorNum = 5;

// Slider

const slider = {
    min: -1,
    max: +1,
    value: 0,
    step: 0.001
};

// const slider = {
//       min: 1,
//       max: 100,
//       value: 50,
//       step: 0.5
// };
  

let videoLine = 0;
let time_scale = 1;
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
      width: 0
    };

    this.canvasRef = null;
    this.ctx = null;
    this.windowWidth = document.body.clientWidth;
    this.lastMajor = initialMajorNum;

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
      time_scale = Math.pow(100, value);
      // time_scale = value;
      this.redrawCanvas();
  }

  //================================================================================
  // Helper Functions
  //================================================================================

  computeMinStepSize(length, majorNum) {
    let majorStepSize = length / majorNum;
    let minorStepSize = majorStepSize / 15;

    // Base case: Stop when min <= minorStepSize <= max
    if ((minStepSize <= minorStepSize) && (minorStepSize <= maxStepSize)) {
      // Make major number even 
      majorNum = majorNum % 2 !== 0 ? majorNum + 1 : majorNum;
      return [minorStepSize, majorStepSize, majorNum];
    }

    if (minorStepSize > maxStepSize) {
      majorNum = Math.ceil(majorNum * 2);
    } else if (minorStepSize < minStepSize) {
      majorNum = Math.floor(majorNum / 2);
    }

    // Further compute
    return this.computeMinStepSize(length, majorNum);
  }

  msToTimecode(duration, fps) {
    let frames = parseInt((duration/1000 * fps) % fps, 10);
    let seconds = parseInt((duration/1000)%60, 10);
    let minutes = parseInt((duration/(1000*60))%60, 10);
    let hours = parseInt((duration/(1000*60*60))%24, 10);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    frames = (frames < 10) ? "0" + frames : frames;
    // frames = ":00";
  
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

      this.drawLine(videoLine);

      this.drawTimeScale(length);
      
    });
  }

  isPowerOfTwo(x)
  {
    return (x & (x - 1)) == 0;
  }
    
  drawTimeScale(length) {
    const duration = 10000;
    // time scale [0.01 - 100]
    // units = distance between marker (pixels)
    var units = ((time_scale * 100)  % 100) + 100;
    let scaled_width = length * time_scale;

    var count = scaled_width / 100;
    var screen_count = length / units;

    console.log('before', count, screen_count, units, time_scale, scaled_width);

    count = Math.pow(2, Math.ceil(Math.log10(count)/Math.log10(2)) + 1);
    screen_count = Math.pow(2, Math.ceil(Math.log(screen_count)/Math.log(2)));

    console.log('after', count, screen_count);
    
    
    for (let i = 0; i < count; i++)
    {
      var t = (i * (duration / count));
      this.drawLabel(parseInt(t).toString(), i * units);
    }
  }

  drawLabel(text, x) {
    const barHeight = 15;
    const y0 = canvasHeight - 2;
    const y1 = y0 - barHeight;
    const x0 = x + 0.5;

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "#808080";
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x0, y1);
    this.ctx.stroke();
    this.writeText(text, x, y1 - 2);
  }

  initCanvas() {
    let length = this.canvasRef.parentNode.clientWidth;

    // Callback method to ensure that the canvas is drawn during initialization
    this.setState({ width: length }, () => {
      // show canvas
      this.canvasRef.style.display = "";
      this.ctx.clearRect(0, 0, length, canvasHeight);

      videoLine = length * 0.75;
      this.drawLine(videoLine);

      this.drawTimeScale(length);
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
            <Slider min={slider.min} max={slider.max} defaultValue={slider.value} step={slider.step} onChange={this.handleSlider}></Slider>
        </SliderContainer>
      </div>
      
    );
  }
}


export default Timeline;
