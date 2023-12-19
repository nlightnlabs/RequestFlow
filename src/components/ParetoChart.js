import React, { useState, useRef, useEffect } from 'react';
import axios from './axios';
import * as d3 from 'd3';
import "bootstrap/dist/css/bootstrap.min.css"

const ParetoChart = (props) => {


  const svgRef = useRef();

    const chartWidth = props.chartWidth || 500
    const chartHeight = props.chartHeight || 300
    const tableName = props.tableName || ""
    const chartTitle = props.chartTitle || ""
    const chartSubTitle = props.chartSubTitle || ""
    const footNotes = props.footNotes || ""
    const categoryLabels = props.categoryLabels || ['Category 1', 'Category 2', 'Category 3','Category 4','Category 5'  ]
    const aggregationMethod = props.aggregationMethod || "count"
    const fieldToAggregate = props.fieldToAggregate || "id"
    const primaryAxisLabel = props.primaryAxisLabel || ""
    const fillColor = props.fillColor || "#9DC3E6"
    const strokeColor = props.strokeColor || "#2E75B6"
    const xAxisLabelRotation = props.xAxisLabelRotation || 0
    const xAxisTextAnchor = props.xAxistextAnchor || "center"
    const xAxisXTextOffset = props.xAxisXTextOffset || 0
    const xAxisYTextOffset = props.xAxisYTextOffset || 0
    const xAxisFontSize = props.xAxisFontSize || 10
    const bottomMargin = props.bottomMargin || 25
    const xAxisLabelWrapWidth = props.xAxisLabelWrapWidth

    const [barData, setBarData] = useState([])
    const [lineData, setLineData] = useState([])

    // const barData = [
    //   { label: 'Category A', value: 90 },
    //   { label: 'Category B', value: 80 },
    //   { label: 'Category C', value: 65 },
    //   { label: 'Category D', value: 50 },
    //   { label: 'Category E', value: 30 },
    //   { label: 'Category F', value: 20 },
    //   { label: 'Category G', value: 10 }
    // ]; // Example data for the bar chart
  
    // const lineData = [
    //   { label: 'Category A', value: 30 },
    //   { label: 'Category B', value: 50 },
    //   { label: 'Category C', value: 78 },
    //   { label: 'Category D', value: 80 },
    //   { label: 'Category E', value: 90 },
    //   { label: 'Category F', value: 95 },
    //   { label: 'Category G', value: 100 }
    // ];

    const getData = async (req, res)=>{

        let query = `SELECT "${categoryLabels}" as label, count(distinct "id") as value from ${tableName} group by "${categoryLabels}" order by count(distinct "id") desc;`

        if (aggregationMethod == "sum"){
          query = `SELECT 
          "${categoryLabels}" as label,
          sum("${fieldToAggregate}) as value
          from requests
          group by "${categoryLabels}"
          order by sum("${fieldToAggregate}) desc
          `
        }

        try{
          const response = await axios.post(`/db/query`,{query: query})
          const data = response.data


          // get total
          let total=0
            data.map(item=>{
              total += parseFloat(item.value)
            })

          console.log(total)

          // Additional fields needed for pareto chart
            var pareto_data =[]
            var running_total = 0
            data.forEach((item)=>{
              var value = Number(item.value)
              var pct_of_total = Number((100*value / total).toFixed(2))
              running_total = Number(parseFloat(running_total + value).toFixed(0))
              var running_pct_of_total = Number(parseFloat(100*(running_total / total)).toFixed(2))
              var new_data = {pct_of_total, running_total,running_pct_of_total}
              var updated_item = {...item,...new_data}
              pareto_data.push(updated_item)
            })

          console.log(pareto_data)

          let barData = []
          pareto_data.map((item)=>{
            barData.push({label: item.label, value: Number(item.value)})
          })
          setBarData(barData)

          let lineData = []
          pareto_data.map((item)=>{
            lineData.push({label: item.label, value: Number(item.running_pct_of_total)})
          })
          setLineData(lineData)

          plotData()

        }catch(error){
          console.log(error)
        }
    }

    
  const plotData = ()=>{


    if (!barData || !lineData) return;

    console.log(barData)
    console.log(lineData)

    console.log(lineData.map(item=>item))

    const svg = d3.select(svgRef.current);

    // Clear existing chart
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 0, bottom: bottomMargin, left: 50 };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // Create the left y-axis for the bar chart
    const yBar = d3.scaleLinear()
      .domain([0, d3.max(barData, d => Number(d.value))])
      .range([height, 0]);

    // Create the right y-axis for the line plot
    const yLine = d3.scaleLinear()
      .domain([0, d3.max(lineData, d => Number(d.value))])
      .range([height, 0]);

    const x = d3.scaleBand()
      .domain(barData.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const xAxis = g => g
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
      

    const yAxisLeft = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yBar));

    const yAxisRight = g => g
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yLine));

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
      .attr('fill', fillColor);

    // Create line plot on the right y-axis
    const line = d3.line()
      .x(d => x(d.label) + x.bandwidth() / 2)
      .y(d => yLine(d.value));

    svg.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1.5)
      .attr('d', line);

    svg.append('g')
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 0)
    // .attr("transform", `rotate(${xAxisLabelRotation})`)
    .attr("dy", ".35em");

      const xScale = d3.scaleBand()
      .domain(barData.map(d => d.label))
      .range([0, chartWidth])
      .padding(0.1);
    
      const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis)
        .style("color", 'gray')
        .style("text-anchor", "center")
        .style("font-size",xAxisFontSize);

    
      function wrap(text, width) {
        text.each(function() {
          const text = d3.select(this);
          const words = text.text().split(/\s+/).reverse();
          let word;
          let line = [];
          let lineNumber = 0;
          const lineHeight = 1.1; // Line height
          const y = text.attr("y");
          const dy = parseFloat(text.attr("dy"));
          let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }

    // Apply text wrapping to x-axis labels
    xAxisGroup.selectAll("text")
    .call(wrap, xAxisLabelWrapWidth || xScale.bandwidth()) // Adjust the width for wrapping
    .attr("transform", `translate(${xAxisXTextOffset}, ${xAxisYTextOffset}), rotate(${xAxisLabelRotation})`)
    .style("text-anchor", `${xAxisTextAnchor}`)


    

  }

  


  useEffect(() => {
    getData()
  }, [props]);

  const titleStyle = {
    fontColor: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 3,
    display: 'block'
  }

  const subTitleStyle = {
    fontColor: 'gray',
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'center',
    padding: 3,
    display: 'block'
  }

  const footNotesStyle = {
    fontColor: 'gray',
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'center',
    padding: 3,
    display: 'block'
  }

  return (
    <div className="d-flex flex-column justify-content-center p-3">

      {chartTitle && <div style={titleStyle}>{chartTitle}</div>}
      
      {chartSubTitle && <div style={subTitleStyle}>{chartSubTitle}</div>}
        
      <div className="d-flex justify-content-center" style={{position: "relative", marginTop: 10}}>
        <svg ref={svgRef} width={chartWidth} height={chartHeight}></svg>
      </div>

      {footNotes && <div style={footNotesStyle}>{footNotes}</div>}
    </div>
  );
};

export default ParetoChart;
