import Slider from "@material-ui/core/Slider";
import { styled } from "@material-ui/core";

export const mapStyles = {
  height: "60vh",
  width: "100%",
};

export const defaultCenter = {
  lat: 48.8334,
  lng: -90.38297,
};

export const marks = [
  {
    value: 2020,
    label: 2030,
  },
  {
    value: 2030,
    label: 2040,
  },
  {
    value: 2040,
    label: 2050,
  },
  {
    value: 2050,
    label: 2060,
  },
  {
    value: 2060,
    label: 2070,
  },
];

export const getColor = (riskRating) => {
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

const blue = "#94b8d0";

export const CustomSlider = styled(Slider)(({ theme }) => ({
  color: blue, //color of the slider between thumbs
  "& .MuiSlider-thumb": {
    backgroundColor: blue, //color of thumbs
  },
  "& .MuiSlider-rail": {
    color: blue, ////color of the slider outside  teh area between thumbs
  },
}));

export const getDecade = (dateString) => {
  const year = new Date(dateString).getFullYear();
  return (Math.floor(year / 10) * 10);
};

export const options = () => ({
  responsive: true,
  title: { text: "Risk Rating over time", display: true },
  scales: {
    x: {
      gridLines: {
        display: false,
      },
    },
    y: {
      gridLines: {
        display: false,
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const value = tooltipItem.parsed.y.toFixed(4);
          const label = tooltipItem.dataset.label || "";
          return `${label}: ${value}`;
        },
      },
    },
  },
});
