import { useState, useEffect } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

export function Table({ selectedDecade, filteredData }) {
  const [tableData, setTableData] = useState([]);
  const [sorting, setSorting] = useState({ column: null, direction: null });
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const handleAssetFilter = (event) => {
    setSelectedAsset(event.target.value);
  };

  const handleCategoryFilter = (event) => {
    setSelectedCategory(event.target.value);
  };

  const decadeData = filteredData.filter(
    (asset) =>
      Math.floor(new Date(asset["Year"]).getFullYear() / 10) * 10 ===
        selectedDecade &&
      (selectedAsset === "All" || asset["Asset Name"] === selectedAsset) &&
      (selectedCategory === "All" ||
        asset["Business Category"] === selectedCategory)
  );

  return (
    <div className="table-container">
      <h3>Table Data for {selectedDecade}s</h3>
      <select value={selectedAsset} onChange={handleAssetFilter}>
        <option value="All">All Assets</option>
        {filteredData
          .map((asset) => asset["Asset Name"])
          .filter((value, index, self) => self.indexOf(value) === index)
          .map((asset) => (
            <option key={asset} value={asset}>
              {asset}
            </option>
          ))}
      </select>

      <select value={selectedCategory} onChange={handleCategoryFilter}>
        <option value="All">All Categories</option>
        {filteredData
          .map((asset) => asset["Business Category"])
          .filter((value, index, self) => self.indexOf(value) === index)
          .map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
      </select>

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
          {decadeData.map((asset, index) => (
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
          width: 100%;
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
