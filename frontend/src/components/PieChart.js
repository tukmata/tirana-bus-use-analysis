import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PieChart = ({ data }) => {
    const chartRef = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2;

        d3.select(chartRef.current).select("svg").remove(); // Clear previous chart

        const svg = d3
            .select(chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Aggregate data for pie chart (example: group by gender)
        const aggregatedData = d3.rollup(
            data,
            (v) => d3.sum(v, (d) => d.total_yield),
            (d) => d.gender
        );

        const pieData = Array.from(aggregatedData, ([key, value]) => ({ key, value }));

        const pie = d3.pie().value((d) => d.value);
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        svg.selectAll("path")
            .data(pie(pieData))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i));

        svg.selectAll("text")
            .data(pie(pieData))
            .enter()
            .append("text")
            .text((d) => d.data.key)
            .attr("transform", (d) => `translate(${arc.centroid(d)})`)
            .style("text-anchor", "middle");
    }, [data]);

    return <div ref={chartRef}></div>;
};

export default PieChart;
