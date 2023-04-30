import React, { useState, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(...registerables);

export function Graph({ data }) {
  const [chartData, setChartData] = useState({});
  const [filter, setFilter] = useState("Location");

  useEffect(() => {
    if (!data) return;

    const filterData = () => {
      let filteredData = {};
      switch (filter) {
        case "Location":
          filteredData = data.reduce((acc, cur) => {
            const key = `${cur.Lat}-${cur.Long}`;
            acc[key] = acc[key] || { labels: [], data: [] };
            acc[key].labels.push(cur.Year);
            acc[key].data.push(cur["Risk Rating"]);
            return acc;
          }, {});
          break;
        case "Asset":
          filteredData = data.reduce((acc, cur) => {
            const key = cur["Asset Name"];
            acc[key] = acc[key] || { labels: [], data: [] };
            acc[key].labels.push(cur.Year);
            acc[key].data.push(cur["Risk Rating"]);
            return acc;
          }, {});
          break;
        case "Business Category":
          filteredData = data.reduce((acc, cur) => {
            const key = cur["Business Category"];
            acc[key] = acc[key] || { labels: [], data: [] };
            acc[key].labels.push(cur.Year);
            acc[key].data.push(cur["Risk Rating"]);
            return acc;
          }, {});
          break;
        default:
          break;
      }
      return filteredData;
    };
    const filteredData = filterData();
    if (!filteredData) return;
    setChartData({
      labels: Object.values(filteredData)[0]?.labels,
      datasets: Object.entries(filteredData).map(([key, value]) => ({
        label: key,
        data: value.data,
        borderColor: getRandomColor(),
        borderWidth: 2,
        fill: false,
      })),
    });
  }, [data, filter]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="line-chart">
      <div className="chart-filters">
        <button onClick={() => setFilter("Location")}>Location</button>
        <button onClick={() => setFilter("Asset")}>Asset</button>
        <button onClick={() => setFilter("Business Category")}>
          Business Category
        </button>
      </div>
      {chartData && chartData.datasets && chartData.datasets.length > 0 && (
        <Line
          data={chartData}
          options={{
            responsive: true,
            title: { text: "Risk Rating over time", display: true },
            scales: {
              xAxes: [{ gridLines: { display: false } }],
              yAxes: [{ gridLines: { display: false } }],
            },
          }}
        />
      )}
    </div>
  );
}
