import React, { useRef } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart: any = CanvasJSReact.CanvasJSChart;

const RevenueChart= ({revenueCurrentWeekResults, RevenueLastWeekResults}:any) => {
  const chartRef = useRef<any>(null);
  const toggleDataSeries = (e: any) => {
    if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chartRef.current.render();
  };

  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };
    

  const options = {
    theme: 'light2',
    animationEnabled: true,
    height: 250,
    subtitles: [{
        text: "Last 7 days VS prior week"
    }],
    axisX: {
      valueFormatString: 'DD MMM', // Display date with day
      labelAngle: -30,
    },
    axisY: {
      title: 'Revenue in Rs.',
      titleFontColor: '#4F81BC',
      lineColor: '#4F81BC',
      labelFontColor: '#4F81BC',
      tickColor: '#4F81BC',
      minimum: 0,
      labelFormatter: function (e: any) {
        return formatNumber(e.value);
      },
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      itemclick: toggleDataSeries
    },
    data: [
      {
        type: 'spline',
        name: 'Last Week',
        showInLegend: true,
        dataPoints: revenueCurrentWeekResults?.map((data:any) => ({
          x: new Date(data.date),
          y: Number(data.totalAmount)
        }))
      },
      
      {
        type: 'spline',
        name: 'Prior Week',
        showInLegend: true,
        dataPoints: RevenueLastWeekResults?.map((data:any) => ({
          x: new Date(data.date),
          y: Number(data.totalAmount)
        }))
      }
    ]
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', borderRadius: "6px" }}>
      <CanvasJSChart options={options} onRef={(ref: any) => (chartRef.current = ref)} />
      <style>
        {`
          .canvasjs-chart-credit {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default RevenueChart;
