import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineChart = ({ data }) => {
    const chartRef = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        // Sanitize data
        const sanitizedData = data.filter(
            (d) => d.time_slot !== undefined && !isNaN(d.total_yield)
        );

        if (sanitizedData.length === 0) {
            console.error("No valid data available for LineChart.");
            return;
        }

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 50, left: 50 };

        d3.select(chartRef.current).select("svg").remove();

        const svg = d3
            .select(chartRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const xScale = d3
            .scalePoint()
            .domain(sanitizedData.map((d) => d.time_slot))
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(sanitizedData, (d) => d.total_yield)])
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(5));

        const line = d3
            .line()
            .x((d) => xScale(d.time_slot))
            .y((d) => yScale(d.total_yield))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(sanitizedData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);
    }, [data]);

    return <div ref={chartRef}></div>;
};

export default LineChart;
