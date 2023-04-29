import { useState, useEffect } from "react";

export function Table({ selectedDecade, filteredData }) {
  const [tableData, setTableData] = useState([]);
  const [sorting, setSorting] = useState({ column: null, direction: null });

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

  const sortTable = (column) => {
    let direction = "asc";
    if (sorting.column === column && sorting.direction === "asc") {
      direction = "desc";
    }
    setSorting({ column, direction });

    const sortedData = [...tableData].sort((a, b) => {
      if (a[column] < b[column]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setTableData(sortedData);
  };

  return (
    <div className="table-container">
      <h3>Table Data for {selectedDecade}s</h3>
      <table>
        <thead>
          <tr>
            <th onClick={() => sortTable("Asset Name")}>Asset Name</th>
            <th onClick={() => sortTable("Business Category")}>
              Business Category
            </th>
            <th onClick={() => sortTable("Risk Rating")}>Risk Rating</th>
            <th onClick={() => sortTable("Risk Factors")}>Risk Factors</th>
            <th onClick={() => sortTable("Year")}>Year</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((asset, index) => (
            <tr key={`${asset["Asset Name"]}-${index}`}>
              <td>{asset["Asset Name"]}</td>
              <td>{asset["Business Category"]}</td>
              <td>{asset["Risk Rating"]}</td>
              <td>{extractWords(asset["Risk Factors"])}</td>
              <td>{asset["Year"]}</td>
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

