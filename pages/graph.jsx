import React, { useState, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import Papa from "papaparse";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { Select, MenuItem, FormControl } from "@material-ui/core";
import "./graph.css";

Chart.register(...registerables);

export default function Graph() {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [location, setLocation] = useState("All");
  const [asset, setAsset] = useState("All");
  const [businessCategory, setBusinessCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const response = await fetch("/sample-data.csv");
      const csv = await response.text();
      const parsed = Papa.parse(csv, { header: true });

      if (isMounted) {
        setData(parsed.data);
      }
    };

    if (!data.length) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    const filterData = () => {
      let filteredData = {};
      if (location) {
        filteredData = data.reduce((acc, cur) => {
          if (`${cur.Lat}-${cur.Long}` === location) {
            acc[cur.Year] = acc[cur.Year] || [];
            acc[cur.Year].push(cur["Risk Rating"]);
          }
          return acc;
        }, {});
      } else if (asset) {
        filteredData = data.reduce((acc, cur) => {
          if (cur["Asset Name"] === asset) {
            acc[cur.Year] = acc[cur.Year] || [];
            acc[cur.Year].push(cur["Risk Rating"]);
          }
          return acc;
        }, {});
      } else if (businessCategory) {
        filteredData = data.reduce((acc, cur) => {
          if (cur["Business Category"] === businessCategory) {
            acc[cur.Year] = acc[cur.Year] || [];
            acc[cur.Year].push(cur["Risk Rating"]);
          }
          return acc;
        }, {});
      }
      return filteredData;
    };

    const filteredData = filterData();
    if (!filteredData) return;
    setChartData({
      labels: Object.keys(filteredData).sort(),
      datasets: [
        {
          label: "Risk Rating",
          data: Object.keys(filteredData)
            .sort()
            .map((year) => filteredData[year][0]),
          borderColor: getRandomColor(),
          borderWidth: 2,
          fill: false,
        },
      ],
    });
  }, [data, location, asset, businessCategory]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <Sidebar />
      <div className="graph-container">
        <div className="content-wrapper">
          <h3>Risk Movement</h3>
          <div className="line-chart">
            <div className="selection">
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  variant="outlined"
                  margin="dense"
                  style={{ fontSize: '13px' }}
                >
                  <MenuItem value="All">Location</MenuItem>
                  {data &&
                    Array.from(
                      new Set(data.map((d) => `${d.Lat}-${d.Long}`))
                    ).map((loc) => (
                      <MenuItem key={loc} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                  id="asset"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  variant="outlined"
                  margin="dense"
                  style={{ fontSize: '13px' }}
                >
                  <MenuItem value="All">Asset Name</MenuItem>
                  {data &&
                    Array.from(new Set(data.map((d) => d["Asset Name"]))).map(
                      (name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                  id="business-category"
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  variant="outlined"
                  margin="dense"
                  style={{ fontSize: '13px' }}
                >
                  <MenuItem value="All">Business Category</MenuItem>
                  {data &&
                    Array.from(
                      new Set(data.map((d) => d["Business Category"]))
                    ).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            {chartData &&
              chartData.datasets &&
              chartData.datasets.length > 0 && (
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
        </div>
      </div>
    </div>
  );
}
