import { useState, useEffect } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

export function Table({ selectedDecade, filteredData }) {
  const [tableData, setTableData] = useState([]);
  const [sorting, setSorting] = useState({ column: null, direction: null });
  const [hoveredColumn, setHoveredColumn] = useState(null);

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

  const getSortingDirection = (column) => {
    if (sorting.column === column) {
      return sorting.direction === "asc" ? <FaCaretUp /> : <FaCaretDown />;
    }
    return null;
  };

  const handleMouseEnter = (column) => {
    setHoveredColumn(column);
  };

  const handleMouseLeave = () => {
    setHoveredColumn(null);
  };

  return (
    <div className="table-container">
      <h3>Table Data for {selectedDecade}s</h3>
      <table>
        <thead>
          <tr>
            <th
              onClick={() => sortTable("Asset Name")}
              onMouseEnter={() => handleMouseEnter("Asset Name")}
              onMouseLeave={() => handleMouseLeave()}
            >
              Asset Name {hoveredColumn === "Asset Name" && <FaCaretDown />}
              {getSortingDirection("Asset Name")}
            </th>
            <th
              onClick={() => sortTable("Business Category")}
              onMouseEnter={() => handleMouseEnter("Business Category")}
              onMouseLeave={() => handleMouseLeave()}
            >
              Business Category{" "}
              {hoveredColumn === "Business Category" && <FaCaretDown />}
              {getSortingDirection("Business Category")}
            </th>
            <th
              onClick={() => sortTable("Risk Rating")}
              onMouseEnter={() => handleMouseEnter("Risk Rating")}
              onMouseLeave={() => handleMouseLeave()}
            >
              Risk Rating {hoveredColumn === "Risk Rating" && <FaCaretDown />}
              {getSortingDirection("Risk Rating")}
            </th>
            <th
              onClick={() => sortTable("Risk Factors")}
              onMouseEnter={() => handleMouseEnter("Risk Factors")}
              onMouseLeave={() => handleMouseLeave("Risk Factors")}
            >
              Risk Factors {hoveredColumn === "Risk Factors" && <FaCaretDown />}
              {getSortingDirection("Risk Factors")}
            </th>
            <th
              onClick={() => sortTable("Year")}
              onMouseEnter={() => handleMouseEnter("Year")}
              onMouseLeave={() => handleMouseLeave()}
            >
              Year {hoveredColumn === "Year" && <FaCaretDown />}
              {getSortingDirection("Year")}
            </th>
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
          background-color: #94b8d0;
          color: white;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}
