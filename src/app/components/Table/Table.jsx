import { useState, useEffect } from "react";
import { Select, MenuItem, FormControl } from "@material-ui/core";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

export function Table({ selectedDecade, filteredData }) {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredTableData, setFilteredTableData] = useState(tableData);
  const [sorting, setSorting] = useState({ column: null, direction: null });

  useEffect(() => {
    setSelectedAsset("All");
    setSelectedCategory("All");
    const decadeData = filteredData.filter(
      (asset) =>
        Math.floor(new Date(asset["Year"]).getFullYear() / 10) * 10 ===
        selectedDecade
    );
    setTableData(decadeData);
    setFilteredTableData(decadeData);
  }, [selectedDecade, filteredData]);

  const extractWords = (str) => {
    return str
      .replace(/[^a-zA-Z0-9:. ]/g, "")
      .replace(/(?<!\d)\s*,\s*|\s+(?!$)/g, " ")
      .replace(/(\d+)\s/g, "$1, ");
  };

  const sortTable = (column) => {
    let direction = "asc";
    if (sorting.column === column && sorting.direction === "asc") {
      direction = "desc";
    }
    setSorting({ column, direction });

    const sortedData = filteredTableData.sort((a, b) => {
      if (a[column] < b[column]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredTableData(sortedData);
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

  const getRiskRatingColor = (riskRating) => {
    if (riskRating < 0.33) {
      return "green";
    } else if (riskRating < 0.66 > 0.33) {
      return "orange";
    } else {
      return "red";
    }
  };

  const handleAssetFilter = (event) => {
    const selected = event.target.value;
    setSelectedAsset(selected);
    setCurrentPage(1);
    const decadeData = filteredData.filter(
      (asset) =>
        Math.floor(new Date(asset["Year"]).getFullYear() / 10) * 10 ===
          selectedDecade &&
        (selected === "All" || asset["Asset Name"] === selected) &&
        (selectedCategory === "All" ||
          asset["Business Category"] === selectedCategory)
    );
    setFilteredTableData(decadeData);
  };

  const handleCategoryFilter = (event) => {
    const selected = event.target.value;
    setSelectedCategory(selected);
    setCurrentPage(1);
    const filtered = tableData.filter(
      (asset) =>
        (Math.floor(new Date(asset["Year"]).getFullYear() / 10) * 10 ===
          selectedDecade &&
          selected === "All") ||
        (asset["Business Category"] === selected &&
          (selectedAsset === "All" || asset["Asset Name"] === selectedAsset))
    );
    setFilteredTableData(filtered);
  };

  const decadeData = filteredData.filter(
    (asset) =>
      Math.floor(new Date(asset["Year"]).getFullYear() / 10) * 10 ===
        selectedDecade &&
      (selectedAsset === "All" || asset["Asset Name"] === selectedAsset) &&
      (selectedCategory === "All" ||
        asset["Business Category"] === selectedCategory)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredTableData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const riskRatingCellStyle = (riskRating) => {
    return {
      color: getRiskRatingColor(riskRating),
    };
  };

  return (
    <div className="table-container">
      <div className="selection">
        <label>Asset Name</label>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select
            value={selectedAsset}
            onChange={handleAssetFilter}
            variant="outlined"
            margin="dense"
            style={{ fontSize: "13px" }}
          >
            <MenuItem value="All">All</MenuItem>
            {filteredData
              .map((asset) => asset["Asset Name"])
              .filter((value, index, self) => self.indexOf(value) === index)
              .sort((a, b) => a.localeCompare(b))
              .map((asset) => (
                <MenuItem key={asset} value={asset}>
                  {asset}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <label>Category</label>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select
            value={selectedCategory}
            onChange={handleCategoryFilter}
            variant="outlined"
            margin="dense"
            style={{ fontSize: "13px" }}
          >
            <MenuItem value="All">All</MenuItem>
            {filteredData
              .map((asset) => asset["Business Category"])
              .filter((value, index, self) => self.indexOf(value) === index)
              .sort((a, b) => a.localeCompare(b))
              .map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>

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
              onClick={() => sortTable("Lat")}
              onMouseEnter={() => handleMouseEnter("Lat")}
              onMouseLeave={() => handleMouseLeave()}
            >
              Lat {hoveredColumn === "Lat" && <FaCaretDown />}
              {getSortingDirection("Lat")}
            </th>
            <th
              onClick={() => sortTable("Long")}
              onMouseEnter={() => handleMouseEnter("Long")}
              onMouseLeave={() => handleMouseLeave()}
            >
              Lat {hoveredColumn === "Long" && <FaCaretDown />}
              {getSortingDirection("Long")}
            </th>
            <th
              onClick={() => sortTable("Business Category")}
              onMouseEnter={() => handleMouseEnter("Business Category")}
              onMouseLeave={() => handleMouseLeave()}
            >
              Business Category
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
              onMouseLeave={() => handleMouseLeave()}
            >
              Risk Factors {hoveredColumn === "Risk Factors" && <FaCaretDown />}
              {getSortingDirection("Risk Factors")}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((asset, index) => (
            <tr key={`${asset["Asset Name"]}-${index}`}>
              <td>{asset["Asset Name"]}</td>
              <td>{asset["Lat"]}</td>
              <td>{asset["Long"]}</td>
              <td>{asset["Business Category"]}</td>
              <td style={riskRatingCellStyle(asset["Risk Rating"])}>
                {asset["Risk Rating"]}
              </td>
              <td>{extractWords(asset["Risk Factors"])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <div>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ border: "none", margin: "5px", backgroundColor: "white" }}
          >
            {"<<"}
          </button>
          <span>
            Page {currentPage} of {Math.ceil(decadeData.length / itemsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(decadeData.length / itemsPerPage)
            }
            style={{ border: "none", margin: "5px", backgroundColor: "white" }}
          >
            {">>"}
          </button>
        </div>
      </div>

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
