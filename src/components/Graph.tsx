import { BPMToTimeData } from "../models/BPMToTimeData.model"
import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3';
import './Graph.css';

type Props = {
    data: BPMToTimeData[];

}
export const Graph: React.FC<Props> = ({ data }) => {
    const graphRef = useRef(undefined);

    useEffect(() => {
        if (data.length < 1) {
            return;
        }

        const node = graphRef?.current;
        while (node.lastElementChild) {
            node.removeChild(node.lastElementChild);
        }


        const margin = { top: 10, right: 30, bottom: 30, left: 60 };
        const width = 460 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        let svg = d3.select(graphRef.current).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");



        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, (d) => d.time))
            .range([0, width]);

        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));

        // Max value observed:
        const max = d3.max(data, (d) => +d.value + 10)

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([50, max])
            .range([height, 0]);
        // svg.append("g")
        //     .call(d3.axisLeft(y));

        // Set the gradient
        svg.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", y(0))
            .attr("x2", 0)
            .attr("y2", y(max))
            .selectAll("stop")
            .data([
                { offset: "0%", color: "blue" },
                { offset: "100%", color: "red" }
            ])
            .enter().append("stop")
            .attr("offset", (d) => d.offset)
            .attr("stop-color", (d) => d.color);

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "url(#line-gradient)")
            .attr("stroke-width", 15)
            .attr("d", d3.line()
                .x((d) => x(d.time))
                .y((d) => y(d.value))
            )
    }, [data]);

    return <div className='Graph' ref={graphRef}>
    </div>;
}