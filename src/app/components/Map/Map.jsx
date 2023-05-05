"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Graph } from "../Graph/Graph";
import { Table } from "../Table/Table";
import { Box } from "@material-ui/core";
import { useRouter } from "next/navigation";
import { RxTable } from "react-icons/rx";
import { RiMapPinLine } from "react-icons/ri";
import { AiOutlineLineChart } from "react-icons/ai";
import { MarkerClusterer } from "@react-google-maps/api";
import {
  marks,
  getColor,
  getDecade,
  mapStyles,
  CustomSlider,
  defaultCenter,
} from "@/app/helper";

export function Map() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [decade, setDecade] = useState(2030);
  const [clusterer, setClusterer] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedDecade, setSelectedDecade] = useState(2030);
  const [displayComponent, setDisplayComponent] = useState("map");

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

  console.log(data);

  const handleMarkerClick = (asset) => {
    setSelectedAsset(asset);
  };

  const handleMapClick = () => {
    setSelectedAsset(null);
  };

  const handleShowMap = () => {
    setDisplayComponent("map");
  };

  const handleShowTable = () => {
    setDisplayComponent("table");
  };

  const handleShowGraph = () => {
    setDisplayComponent("graph");
  };

  const getAverageRiskRating = (location) => {
    const markersAtLocation = filteredData.filter(
      (asset) =>
        asset.Lat === location.lat().toString() &&
        asset.Long === location.lng().toString()
    );
    const sumRiskRatings = markersAtLocation.reduce(
      (sum, asset) => sum + parseFloat(asset["Risk Rating"]),
      0
    );
    return sumRiskRatings / markersAtLocation.length;
  };

  const getClusterColor = (location) => {
    const averageRiskRating = getAverageRiskRating(location);
    return getColor(averageRiskRating);
  };

  const handleSliderChange = (event, newValue) => {
    setSelectedDecade(newValue);
    console.log(newValue);
  };

  const onClustererLoad = (clusterer) => {
    setClusterer(clusterer);
  };

  useEffect(() => {
    if (data.length > 0) {
      const filteredData = data.filter(
        (asset) => getDecade(asset["Year"]) === selectedDecade
      );
      console.log(filteredData);
      setFilteredData(filteredData);
    }
  }, [data, selectedDecade]);

  const mapId = process.env.NEXT_PUBLIC_MAP_ID;

  const slider = (
    <div className="selection-slider">
      <label>Select Decade</label>
      <div className="slider-container">
        <Box sx={{ width: 200 }}>
          <CustomSlider
            aria-label="Custom marks"
            value={selectedDecade}
            onChange={handleSliderChange}
            min={2020}
            max={2060}
            step={10}
            marks={marks}
          />
        </Box>
      </div>
    </div>
  );

  return (
    <div>
      <div className="button-wrapper">
        <button
          className={`button-menu ${
            displayComponent === "map" ? "active" : ""
          }`}
          onClick={handleShowMap}
        >
          <RiMapPinLine size={20} />
          Risk Map
        </button>
        <button
          className={`button-menu ${
            displayComponent === "table" ? "active" : ""
          }`}
          onClick={handleShowTable}
        >
          <RxTable size={20} />
          Risk Table
        </button>
        <button
          className={`button-menu ${
            displayComponent === "graph" ? "active" : ""
          }`}
          onClick={handleShowGraph}
        >
          <AiOutlineLineChart size={20} />
          Risk Graph
        </button>
      </div>
      <hr />
      {displayComponent === "map" && (
        <div className="map-container">
          {slider}
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY}>
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={3.5}
              center={defaultCenter}
              onClick={handleMapClick}
              height="10%"
              options={{
                mapId: mapId,
                mapTypeControl: false,
                streetViewControl: false,
                keyboardShortcuts: false,
              }}
            >
              <MarkerClusterer
                onLoad={onClustererLoad}
                averageCenter
                gridSize={60}
                zoomOnClick={false}
                minimumClusterSize={5}
                maxZoom={15}
              >
                {(clusterer) =>
                  filteredData.map((asset, index) =>
                    window.google ? (
                      <Marker
                        key={`${asset["Asset Name"]}-${index}`} // Concatenate the name with index
                        position={{
                          lat: Number(asset.Lat),
                          lng: Number(asset.Long),
                        }}
                        onClick={() => handleMarkerClick(asset)}
                        icon={{
                          url: `http://maps.google.com/mapfiles/ms/icons/${getColor(
                            asset["Risk Rating"]
                          )}-dot.png`,
                          scaledSize: new window.google.maps.Size(30, 30),
                        }}
                        clusterer={clusterer}
                        cluster={{
                          averageRiskRating: getAverageRiskRating,
                          styles: [
                            {
                              textColor: "white",
                            },
                          ],
                        }}
                      >
                        {selectedAsset === asset && (
                          <InfoWindow
                            onCloseClick={() => setSelectedAsset(null)}
                          >
                            <div>
                              <p>{asset["Asset Name"]}</p>
                              <p>{asset["Business Category"]}</p>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    ) : null
                  )
                }
              </MarkerClusterer>
            </GoogleMap>
            <style jsx>{`
              .map-container {
                height: 100vh;
                width: 100%;
              }
            `}</style>
          </LoadScript>
        </div>
      )}
      {displayComponent === "table" && (
        <div>
          {slider}
          <Table selectedDecade={selectedDecade} filteredData={filteredData} />
        </div>
      )}
      {displayComponent === "graph" && <Graph data={data} />}
    </div>
  );
}
