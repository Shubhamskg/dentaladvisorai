import { useMemo } from "react";
import * as d3 from "d3";
import { AxisBottom } from "./AxisBottom";
import {scaleLinear} from "d3-scale"

const MARGIN = { top: 0, right: 10, bottom:50, left: 5};
const x = d3.scaleUtc()


export const DensityChart = ({ width, height, data,mini,maxi }) => {
  console.log("d",data)
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    // const max = Math.max(...data);
    return scaleLinear()
      .domain([0,1.2* maxi]) // note: limiting to 1000 instead of max here because of extreme values in the dataset
      .range([0, boundsWidth]);
  }, [data, width]);
  console.log("xscale",xScale)

  // Compute kernel density estimation
  const density = useMemo(() => {
    const kde = kernelDensityEstimator(kernelEpanechnikov(7), xScale.ticks(50));
    return kde(data);
  }, [xScale]);
  console.log("density",density)
  // bins = d3.histogram().domain(x.domain()).thresholds(40)(data);


  const yScale = useMemo(() => {
    const max = Math.max(...density.map((d) => d[1]));
    const min = Math.min(...density.map((d) => d[1]));
    console.log("max",max)
    console.log("min",min)
    return d3.scaleLinear().range([boundsHeight, 0]).domain([min, max]);
  }, [data, height]);
  console.log("yscale",yScale)

  const paths = useMemo(() => {
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveBasis);
    return lineGenerator(density);
  }, [density]);

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        <path
          d={paths}
          fill="#38B3AE"
          opacity={0.6}
          stroke="black"
          strokeWidth={1}
          strokeLinejoin="round"
        />

        {/* X axis, use an additional translation to appear at the bottom */}
        <g transform={`translate(0, ${boundsHeight})`}>
          <AxisBottom xScale={xScale} pixelsPerTick={50} />
        </g>
      </g>
    </svg>
  );
};

// TODO: improve types
// Function to compute density
function kernelDensityEstimator(kernel,X) {
  return function (V) {
    return X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);
  };
}

function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}
