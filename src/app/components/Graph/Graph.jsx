import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { options } from "@/app/helper";
import { Chart, registerables } from "chart.js";
import { Select, MenuItem, FormControl } from "@material-ui/core";

Chart.register(...registerables);

export function Graph({ data }) {
  const [asset, setAsset] = useState("All");
  const [chartData, setChartData] = useState({});
  const [location, setLocation] = useState("All");
  const [businessCategory, setBusinessCategory] = useState("All");

  useEffect(() => {
    if (!data) return;

    const filterData = () => {
      let selectedData = data;
      if (location !== "All") {
        selectedData = selectedData.filter(
          (d) => `${d.Lat}-${d.Long}` === location
        );
      }
      if (asset !== "All") {
        selectedData = selectedData.filter((d) => d["Asset Name"] === asset);
      }
      if (businessCategory !== "All") {
        selectedData = selectedData.filter(
          (d) => d["Business Category"] === businessCategory
        );
      }
      return selectedData;
    };

    const filteredData = filterData();
    const groupedData = filteredData.reduce((acc, cur) => {
      acc[cur.Year] = acc[cur.Year] || [];
      acc[cur.Year].push(parseFloat(cur["Risk Rating"]));
      return acc;
    }, {});
    const labels = Object.keys(groupedData).sort();
    const datasets = [
      {
        label: "Risk Rating",
        data: labels.map(
          (year) =>
            groupedData[year].reduce((acc, cur) => acc + cur, 0) /
            groupedData[year].length
        ),
        borderColor: "#0077be",
        borderWidth: 2,
        fill: false,
      },
    ];
    setChartData({ labels, datasets });
  }, [data, location, asset, businessCategory]);

  return (
    <div>
      <div className="line-chart">
        <div className="selection">
          <label>Location</label>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              variant="outlined"
              margin="dense"
              style={{ fontSize: "13px" }}
            >
              <MenuItem value="All">All</MenuItem>
              {data &&
                Array.from(new Set(data.map((d) => `${d.Lat}-${d.Long}`)))
                  .sort()
                  .map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>

          <label>Asset Name</label>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              id="asset"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              variant="outlined"
              margin="dense"
              style={{ fontSize: "13px" }}
            >
              <MenuItem value="All">All</MenuItem>
              {data &&
                Array.from(new Set(data.map((d) => d["Asset Name"])))
                  .sort()
                  .map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>

          <label>Business Category</label>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              id="business-category"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              variant="outlined"
              margin="dense"
              style={{ fontSize: "13px" }}
            >
              <MenuItem value="All">All</MenuItem>
              {data &&
                Array.from(new Set(data.map((d) => d["Business Category"])))
                  .sort()
                  .map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </div>
        {chartData && chartData.datasets && chartData.datasets.length > 0 && (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
