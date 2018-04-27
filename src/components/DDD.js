

import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

// slider
import InputRange from 'react-input-range';
import './react-input-range.css';

import './DDD.css';

const SliderContainer = styled.div`
  padding: 30px;
`;

// Global Variable

const canvasHeight = 30;
const marginTop = 29;

const videoLength = 60 * 4;
const bufferVideo = videoLength * 1.5;
let minToStart = 0;
let endToMax = 0;
const reso = 2;
let steps = bufferVideo / (1000);

const data = [{"x": 0 , "y":  29},
              {"x": videoLength, "y":  29}];

const items = [{"start": 5, "end": 20},
              {"start": 26, "end": 42},
              {"start": 58, "end": 61},
              {"start": 62, "end": 90},
              {"start": 96, "end": 126},
              {"start": 177, "end": 196},
              {"start": 237, "end": 300}];

let lastFrom = 0;
let lastTo = 1030;
let lastDelta = endToMax;
let diffPan = 0;
let mode = 'init';

class DDD extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      width: document.body.clientWidth,
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

    this.createTimeline = this.createTimeline.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.zoomFunction = this.zoomFunction.bind(this);
  }

  //================================================================================
  // Lifecycle
  //================================================================================

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.createTimeline();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  componentDidUpdate() {
    this.renderTimeline();
  }

  //================================================================================
  // Handler
  //================================================================================

  handleResize() {
    this.setState({width: document.body.clientWidth});
    this.renderTimeline();
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

    if (delta !== lastDelta) {
      mode ="zoom";
      // if ((to < lastTo) || (from > lastFrom)) {
      if (from !== lastFrom) {
        mode="L";
      } else {
        mode="R";
      }
      lastFrom = from;
      lastTo = to;
      lastDelta = delta;
    } else {
      mode ="pan";
      diffPan = from - lastFrom;
      lastFrom = from;
    }
  }

  //================================================================================
  // Helper
  //================================================================================

  msToTimecode(d) {
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

  secToTimecode(d) {
    // convert milliseconds to seconds
    let seconds = d;
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds = Math.floor(seconds - minutes * 60 - hours * 3600);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    // Temporary hardcode the frame to 00
    return hours + ":" + minutes + ":" + seconds;
  }

  createTimeline() {
    this.svg = d3.select(this.timeNode);

    // Scale
    this.xScale = d3.scaleTime()
      .domain([0,bufferVideo - steps * endToMax])
      .range([0, document.body.clientWidth]);

    this.videoLineScale = d3.line()
      .x(d => this.xScale(d.x))
      .y(d => d.y);

    // Label Axis
    this.xAxis = d3.axisTop()
      .scale(this.xScale)
      .tickSize(15, 15)
      .tickFormat(this.secToTimecode);
      // .tickFormat(d3.format('d'));

    // Minor Marker Axis
    this.xAxisGrid = d3.axisTop()
      .scale(this.xScale)
      .ticks(100)
      .tickSize(9)
      .tickFormat('');

    // Label
    this.xAxisElement = this.svg
      .append('g')
      .attr('class', 'labelMarker')
      .attr("transform", "translate(0," + marginTop + ")")
      .call(this.xAxis);

    // Minor marker
    this.xGrid = this.svg
      .append('g')
      .attr('class', 'minorMarker')
      .attr('transform', 'translate(0,' + marginTop + ')')
      .call(this.xAxisGrid);

    this.videoLine = this.svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", this.videoLineScale)
      .attr("stroke-width", 1)
      .attr("stroke", "yellow");

    this.drawBox();
    
    // Register click event
    this.svg.on('click', function() {
      console.log(d3.event.pageX);
    });
  }

  zoomFunction() {
    // this.svg.attr("transform", d3.event.transform);
  }

  renderTimeline() {   
    let domainX = minToStart * steps;
    let domainY = bufferVideo - steps * endToMax + 1;
    this.xScale.domain([domainX, domainY]); // [start, end]
    this.xScale.range([0, document.body.clientWidth]);
    this.xAxisElement.call(this.xAxis);
    this.xGrid.call(this.xAxisGrid);
    this.videoLine.attr("d", this.videoLineScale);

    this.drawBox();
  }

  drawBox() {
    
    this.insightContainer = d3.select(this.insightNode);

    let self = this;
    this.insight = this.insightContainer
      .selectAll("rect")
      .data(items)
      .attr("x", function(d, i) {
        return self.xScale(d.start);
      })
      .attr("width", function(d) {
        return self.xScale(d.end) - self.xScale(d.start);
      });

    this.insight.enter()
      .append('rect')
      .attr("x", function(d, i) {
        return self.xScale(d.start);
      })
      .attr("y", 5)
      .attr("width", function(d) {
        return self.xScale(d.end) - self.xScale(d.start);
      })
      .attr("height", 20)
      .attr("fill", "teal")
      .on('click', function() {
        d3.select(this).style('fill', 'yellow');
      });

    this.insight.exit().remove();
  }

  render() {
    return (
      <div>
        <svg ref={node => this.timeNode = node}
          width={this.state.width} height={canvasHeight}>
        </svg>
        <svg ref={node => this.insightNode = node}
          width={this.state.width} height={canvasHeight}>
        </svg>
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
      </div>
    );
  }
}

export default DDD;
