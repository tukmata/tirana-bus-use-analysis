import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
    const chartRef = useRef();

    useEffect(() => {
        if (data.length === 0) return;

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
            .scaleBand()
            .domain(data.map((d) => d.bus_line))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.total_yield)])
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat((d) => `Bus ${d}`));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(5));

        const tooltip = d3.select(chartRef.current)
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "rgba(255, 255, 255, 0.8)")
            .style("border", "1px solid #ccc")
            .style("padding", "5px")
            .style("border-radius", "5px");

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d) => xScale(d.bus_line))
            .attr("y", (d) => yScale(d.total_yield))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - margin.bottom - yScale(d.total_yield))
            .attr("fill", "steelblue")
            .on("mouseover", (event, d) => {
                tooltip
                    .style("visibility", "visible")
                    .html(`Bus Line: ${d.bus_line}<br>Yield: ${d.total_yield.toFixed(2)} LEK`);
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("top", `${event.pageY - 10}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });
    }, [data]);

    return <div ref={chartRef} style={{ position: "relative" }}></div>;
};

export default BarChart;
