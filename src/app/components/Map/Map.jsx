"use client";

import { useEffect, useState } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Papa from "papaparse";
import { Table } from "../Table/Table";
import { Box } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { styled } from "@material-ui/core";
import { MarkerClusterer } from "@react-google-maps/api";

export function Map() {
  const [data, setData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedDecade, setSelectedDecade] = useState(2030);
  const [filteredData, setFilteredData] = useState([]);
  const [clusterer, setClusterer] = useState(null);
  const [decade, setDecade] = useState(2030);

  const mapStyles = {
    height: "60vh",
    width: "100%",
  };

  const defaultCenter = {
    lat: 48.8334,
    lng: -90.38297,
  };

  const marks = [
    {
      value: 2030,
      label: 2030,
    },
    {
      value: 2040,
      label: 2040,
    },
    {
      value: 2050,
      label: 2050,
    },
    {
      value: 2060,
      label: 2060,
    },
    {
      value: 2070,
      label: 2070,
    },
  ];

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

  const getColor = (riskRating) => {
    if (riskRating < 0.25) {
      return "green";
    } else if (riskRating < 0.5) {
      return "yellow";
    } else if (riskRating < 0.75) {
      return "orange";
    } else {
      return "red";
    }
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
  };

  const getDecade = (dateString) => {
    const year = new Date(dateString).getFullYear();
    return Math.floor(year / 10) * 10;
  };

  const onClustererLoad = (clusterer) => {
    setClusterer(clusterer);
  };

  const blue = "#94b8d0";

  const CustomSlider = styled(Slider)(({ theme }) => ({
    color: blue, //color of the slider between thumbs
    "& .MuiSlider-thumb": {
      backgroundColor: blue, //color of thumbs
    },
    "& .MuiSlider-rail": {
      color: blue, ////color of the slider outside  teh area between thumbs
    },
  }));

  useEffect(() => {
    if (data.length > 0) {
      const filteredData = data.filter(
        (asset) => getDecade(asset["Year"]) === selectedDecade
      );
      setFilteredData(filteredData);
    }
  }, [data, selectedDecade]);

  const mapId = process.env.NEXT_PUBLIC_MAP_ID;

  return (
    <div>
      <h3>Select Decade</h3>
      <div className="slider-container">
        <Box sx={{ width: 300 }}>
          <CustomSlider
            aria-label="Custom marks"
            value={selectedDecade}
            onChange={handleSliderChange}
            min={2030}
            max={2070}
            step={10}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Box>
      </div>
      <div className="map-container">
        <h3>Risk Map for {selectedDecade}s</h3>
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
                        <InfoWindow onCloseClick={() => setSelectedAsset(null)}>
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
      <Table selectedDecade={selectedDecade} filteredData={filteredData} />
    </div>
  );
}
