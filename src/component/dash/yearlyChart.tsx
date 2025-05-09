import  React from 'react';
import * as d3 from 'd3';

interface PieChartData {
  value: number;
}

const YearlyChart = ({achievedData, bg, color}: any) => {
  const width = 100;
  const height = 100;
  
  const outerRadius = width / 2;
  const innerRadius = 36;
     
  const data: PieChartData[] = [{ value: Number(achievedData) <= 100 ? Number(achievedData) : 100 }];
  
  const pie = d3.pie<PieChartData>().value((d) => d.value);
  
  const endAng = (d: PieChartData) => (d.value / 100) * Math.PI * 2;
  
  const bgArc: any = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(0)
    .endAngle(Math.PI * 2);
  
  const dataArc: any = d3.arc<PieChartData>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(15)
    .startAngle(0);

  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg.attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "shadow")
      .classed("svg-content", true);

    const path = svg
      .selectAll("g")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    path
      .append("path")
      .attr("d", bgArc)
      .style("stroke-width", 5)
      .attr("fill", bg);

    path
      .append("path")
      .attr("fill", color)
      .transition()
      .ease(d3.easeSinOut)
      .duration(750)
      .attrTween("d", arcTween);

    path
      .append("text")
      .attr("fill", "#fff")
      .attr("font-size", ".9em")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // Adjust the vertical position
      .attr("x", -3) // Center horizontally
      .transition()
      .ease(d3.easeSinOut)
      .duration(750)
      .attr("fill", "#000")
      .text((d: any) => d.data.value); // Corrected access to the data property

    path
      .append("text")
      .attr("fill", "#fff")
      .attr("class", "ratingtext")
      .attr("font-size", "0.6em")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("dy", "0.6em") // Adjust the vertical position
      .attr("x", 20) // Center horizontally
      .text("%")
      .transition()
      .ease(d3.easeSinOut)
      .duration(750)
      .attr("fill", "#000");

    function arcTween(d: any) {
      const interpolate = d3.interpolate(d.startAngle, endAng(d));
      return (t: any) => {
        d.endAngle = interpolate(t);
        return dataArc(d);
      };
    }
  }, []);

  return (
    <div>
      <svg ref={svgRef} className='chart-svg chart-area shadow' />
      <style>
        {`
          .chart-area {
            margin: 5em auto; /* Adjusted to center horizontally */
          }
          .shadow {
            filter: drop-shadow(0px 5px 4px rgba(0, 0, 0, .4));
          }
        `}
      </style>
    </div>
  );
};

export default YearlyChart;
