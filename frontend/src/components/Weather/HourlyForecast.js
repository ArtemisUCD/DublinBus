import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { useLayoutEffect, useRef } from "react";

export default function (props) {
    const chart = useRef(null);

    console.log(props.data);
  
    useLayoutEffect(() => {
      let x = am4core.create("chartdiv", am4charts.XYChart);
  
      x.paddingRight = 20;
  
      let chartData = props.data && props.data.map((item, i) => ({
        date: item.date * 1000,
        name: "name" + i,
        value: item.temperature - 273.15
      }));
  
      x.data = chartData;
  
      let dateAxis = x.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.baseInterval = {
        timeUnit: "hour",
        count: 1
      };
  
      let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;
  
      let series = x.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tooltipText = "{valueY.value}";
      x.cursor = new am4charts.XYCursor();
  
      chart.current = x;
  
      return () => {
        x.dispose();
      };
    }, [props.data]);
  
    return (
      <div className="hourly-forecast">
        <h3>Hourly forecast (°C)</h3>
        <div id="chartdiv" style={{ width: "100%", height: "370px" }}></div>
      </div>
    );
  }