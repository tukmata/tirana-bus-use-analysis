import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { saveAs } from "file-saver";

const PieChart = ({ data }) => {
    const chartRef = useRef();

    useEffect(() => {
        if (data.length === 0) return;

        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2;

        // Clear previous chart
        d3.select(chartRef.current).select("svg").remove();

        const svg = d3
            .select(chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const labelArc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.6);

        const pie = d3.pie().value((d) => d.total_revenue);

        const totalRevenue = d3.sum(data, (d) => d.total_revenue);

        // Tooltip
        const tooltip = d3
            .select(chartRef.current)
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("padding", "5px")
            .style("border-radius", "5px");

        // Draw Pie Chart
        const pieGroups = svg.selectAll("path")
            .data(pie(data))
            .enter()
            .append("g");

        pieGroups
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i))
            .on("mouseover", (event, d) => {
                const percentage = ((d.data.total_revenue / totalRevenue) * 100).toFixed(2);
                tooltip
                    .style("visibility", "visible")
                    .html(
                        `<strong>Age Group:</strong> ${d.data.age_group}<br>
                        <strong>Total Revenue:</strong> ${d.data.total_revenue} LEK<br>
                        <strong>Percentage:</strong> ${percentage}%`
                    );
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("top", `${event.pageY - 10}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });

        // Add labels
        pieGroups
            .append("text")
            .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#000")
            .text((d) => `${d.data.age_group}`);

        // Add legends
        const legend = svg.append("g")
            .attr("transform", `translate(-${width / 2},${height / 2 + 20})`);

        legend
            .selectAll("rect")
            .data(pie(data))
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 100)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", (d, i) => color(i));

        legend
            .selectAll("text")
            .data(pie(data))
            .enter()
            .append("text")
            .attr("x", (d, i) => i * 100 + 15)
            .attr("y", 10)
            .style("font-size", "12px")
            .text((d) => d.data.age_group);
    }, [data]);

    // Export Chart as SVG
    const exportChart = () => {
        const svgNode = d3.select(chartRef.current).select("svg").node();
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgNode);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        saveAs(blob, "piechart.svg");
    };

    return (
        <div>
            <div ref={chartRef}></div>
            <button onClick={exportChart} className="btn btn-outline-primary mt-3">
                Export Chart as Image
            </button>
        </div>
    );
};

export default PieChart;
