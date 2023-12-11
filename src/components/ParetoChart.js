import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ParetoChart = ({ barData, lineData, chartWidth, chartHeight }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!barData || !lineData) return;

    const svg = d3.select(svgRef.current);

    // Clear existing chart
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 50, left: 40 };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // Create the left y-axis for the bar chart
    const yBar = d3.scaleLinear()
      .domain([0, d3.max(barData, d => d.value)])
      .range([height, 0]);

    // Create the right y-axis for the line plot
    const yLine = d3.scaleLinear()
      .domain([0, d3.max(lineData, d => d.value)])
      .range([height, 0]);

    const x = d3.scaleBand()
      .domain(barData.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const xAxis = g => g
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const yAxisLeft = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yBar));

    const yAxisRight = g => g
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yLine));

    svg.append('g').call(xAxis);

    svg.append('g').call(yAxisLeft)
      .selectAll('.tick line')
      .attr('stroke-opacity', 0.2);

    svg.append('g').call(yAxisRight)
      .selectAll('.tick line')
      .attr('stroke-opacity', 0.1);

    // Create bars for the bar chart on the left y-axis
    svg.selectAll('.bar')
      .data(barData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label))
      .attr('y', d => yBar(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - yBar(d.value))
      .attr('fill', 'steelblue');

    // Create line plot on the right y-axis
    const line = d3.line()
      .x(d => x(d.label) + x.bandwidth() / 2)
      .y(d => yLine(d.value));

    svg.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.5)
      .attr('d', line);

  }, [barData, lineData]);

  return (
    <div>
      <h3>Pareto Chart</h3>
        <svg ref={svgRef} width={chartWidth} height={chartHeight}>
          {/* SVG content will be rendered here */}
        </svg>
    </div>
  );
};

export default ParetoChart;
