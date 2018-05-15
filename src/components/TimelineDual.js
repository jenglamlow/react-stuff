import React, { Component } from 'react';
import styled from 'styled-components';
import InputRange from 'react-input-range';
import './react-input-range.css';
import 'ion-rangeslider/css/ion.rangeSlider.css';
import 'ion-rangeslider/css/ion.rangeSlider.skinNice.css';

import $ from 'jquery';
import ionRangeSlider from 'ion-rangeslider';


const canvasHeight = 30;

const videoLength = 50 * 60 * 1000;
let minToStart = 0;
let endToMax = 0;
let remainingUnitR = 0;
let remainingUnitL = 0;
let offsetR = remainingUnitR/ endToMax || 0;
let offsetL = remainingUnitL/ minToStart || 0;
let start = 0;
let end = 0;

let C = 1;
let base = Math.log2(videoLength/(C * 1000));
let scale = 1;
let units = 100;

let lastFrom = 0;
let lastTo = 1030;
let lastDelta = endToMax;
let diffPan = 0;
let mode = 'init';
let steps = videoLength/1000 / (C * Math.pow(2, 1));

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
      min: 0,
      max: 1030,
      step: 1,
      value: {
        max: 1030 - endToMax,
        min: 0,
      },
      last: {
        max: 1030,
        min: 0
      }
    };

    this.canvasRef = null;
    this.sliderRef = null;
    this.slider = null;
    this.ctx = null;
    this.windowWidth = document.body.clientWidth;

    // Bind 'this' property into the event handler
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSlider = this.handleSlider.bind(this);

    // Callback to bind the DOM ref
    this.setCanvasRef = dom => {
      this.canvasRef = dom;
    };

    this.setSliderRef = dom => {
      this.sliderRef = dom;
    };
  }


  //================================================================================
  // React Lifecycle
  //================================================================================
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);

    $(this.sliderRef).ionRangeSlider({
      type: "double",
      min: 0,
      max: 1.03,
      from: 0,
      to: 1.03 - endToMax,
      step: 0.001,
      drag_interval: true,
      hide_min_max: true,
      hide_from_to: true,
      onChange: this.handleSlider
    });
    this.slider = $(this.sliderRef).data("ionRangeSlider");
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
  }

  handleOnChange(value) {
    const last = this.state.last;
    const from = value.min;
    const to = value.max;
    const diff = to - from;

    // Prevent value exceed limit (bug in slider library)
    if ((value.min < this.state.min) || (value.max > this.state.max)) {
      return;
    }

    // Keep a minimum gap in the range
    if (diff < 30) {
      return;
    }

    const deltaFrom = from - this.state.min;
    const deltaTo = this.state.max - to;
    // [0.000, 1.000]
    const delta = deltaFrom + deltaTo;

    this.setState({ value: value });

    minToStart = value.min;
    endToMax = this.state.max - value.max;

    scale = Math.pow(base, delta/1000);

    if (delta !== lastDelta) {
      mode ="zoom";
      // if ((to < lastTo) || (from > lastFrom)) {
      if (from !== lastFrom) {
        mode="L";
      } else {
        mode="R";
      }
      // } else {
      //   mode="zoomout";
      // }
      lastFrom = from;
      lastTo = to;
      lastDelta = delta;
    } else {
      mode ="pan";
      diffPan = from - lastFrom;
      // if (from > lastFrom ) {
      //   // console.log('>>>>>>', from, diff);
      // } else {
      //   // console.log('<<<<<<', from, diff);
      // }
      lastFrom = from;
    }

    this.redrawCanvas();
  }

  handleSlider(value) {
    // console.log(value);
    // console.log(value.to, value.from, lastTo, lastFrom);
    // let diff = value.to - value.from;
    // if (diff < 0.04) {
    //   this.slider.update({
    //     to: lastTo,
    //     from: lastFrom
    //   });
    //   return;
    // }

    // const deltaFrom = parseFloat((value.from - value.min).toFixed(3));
    // const deltaTo = parseFloat((value.max - value.to).toFixed(3));
    // // [0.000, 1.000]
    // const delta = parseFloat((deltaFrom + deltaTo).toFixed(3));

    console.log(value.from, value.to);

    // if (delta != lastDelta) {
    //   if ((value.to < lastTo) || (value.from > lastFrom)) {
    //     console.log('++');
    //   } else {
    //     console.log('--');
    //   }
    //   lastDelta = delta;
    // } else {
    //   diffPan = value.from - lastFrom;
    //   if (value.from > lastFrom ) {
    //     console.log('>>>>>>', value.from, diff);
    //   } else {
    //     console.log('<<<<<<', value.from, diff);
    //   }
    // }

    // lastTo = value.to;
    // lastFrom = value.from;

    // this.redrawCanvas();
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
    // units = 100;
    // steps = 2;
    let d = duration /1000;

    if (mode ==='pan') {
      start = start - (offsetR * diffPan);
      end = end - (offsetL * diffPan);
      start = start > 0 ? 0 : start;
    } else if (mode !== "init") {
      let K = 100;
      const R = (scale * K)  % K;
      units = R + K;  // pixel position

      const Q = Math.floor(scale);
      steps = d / (C * Math.pow(2, Q));
      // zoom
      if (mode === 'R') { 
        remainingUnitR = (length * Math.pow(2, Q-1) * (scale % 1 + 1)) - length;
        // console.log(remainingUnit, scale, Q);
        offsetR = remainingUnitR/endToMax || 0;
      } else {
        remainingUnitL = (length * Math.pow(2, Q-1) * (scale % 1 + 1)) - length;
        offsetL = remainingUnitL/minToStart || 0;
      }
    }

    steps = Math.pow(2, Math.ceil(Math.log2(steps)));

    let viewCount = length/units + 1;

    for (let i = 0; i < viewCount; i++)
    {
      let labelPos = (i * units) + (start % units) ;
      this.drawBar({
        type: 'label',
        x: labelPos,
        text: (i + (Math.abs(Math.ceil(start/units)))) * steps
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
    this.ctx.fillText(text, x, y);
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
        <br />
        <SliderContainer>
          <InputRange
            draggableTrack
            // formatLabel={value => ''}
            step={this.state.step}
            maxValue={this.state.max}
            minValue={this.state.min}
            onChange={this.handleOnChange}
            value={this.state.value} />
        </SliderContainer>
        <SliderContainer>
          <input type="text" name="slider" ref={this.setSliderRef} />
        </SliderContainer>
      </div>

    );
  }
}


export default TimelineDual;
