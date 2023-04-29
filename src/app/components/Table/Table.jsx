import { useState, useEffect } from "react";

export function Table({ selectedDecade, filteredData }) {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const decadeData = filteredData.filter(
      (asset) =>
        Math.floor(new Date(asset["Year"]).getFullYear() / 10) * 10 ===
        selectedDecade
    );
    setTableData(decadeData);
  }, [selectedDecade, filteredData]);

  const extractWords = (str) => {
    return str.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, ", ");
  };

  return (
    <div className="table-container">
      <h3>Table Data for {selectedDecade}s</h3>
      <table>
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Business Category</th>
            <th>Risk Rating</th>
            <th>Risk Factors</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((asset, index) => (
            <tr key={`${asset["Asset Name"]}-${index}`}>
              <td>{asset["Asset Name"]}</td>
              <td>{asset["Business Category"]}</td>
              <td>{asset["Risk Rating"]}</td>
              <td>{extractWords(asset["Risk Factors"])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .table-container {
          width: 80%;
          margin: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th,
        td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #94B8D0;
          color: white;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}
