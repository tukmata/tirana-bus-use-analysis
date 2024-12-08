import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
    const chartRef = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 50, left: 50 };

        d3.select(chartRef.current).select("svg").remove(); // Clear previous chart

        const svg = d3
            .select(chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const xScale = d3
            .scalePoint()
            .domain(data.map((d) => d.time_slot))
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.total_yield)])
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        const line = d3
            .line()
            .x((d) => xScale(d.time_slot))
            .y((d) => yScale(d.total_yield))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);
    }, [data]);

    return <div ref={chartRef}></div>;
};

export default LineChart;
