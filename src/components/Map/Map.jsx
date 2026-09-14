import React, { useCallback, useRef, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import Rating from "@material-ui/lab/Rating";

import useStyles from "./styles.js";

const MAP_STYLES = [
  { id: "streets", label: "Calles", url: "mapbox://styles/mapbox/streets-v12" },
  { id: "satellite", label: "Satélite", url: "mapbox://styles/mapbox/satellite-v9" },
  { id: "satellite-streets", label: "Satélite + Calles", url: "mapbox://styles/mapbox/satellite-streets-v12" },
  { id: "outdoors", label: "Exterior", url: "mapbox://styles/mapbox/outdoors-v12" },
  { id: "light", label: "Claro", url: "mapbox://styles/mapbox/light-v11" },
  { id: "dark", label: "Oscuro", url: "mapbox://styles/mapbox/dark-v11" },
];

const MapComponent = ({
  setCoordinates,
  setBounds,
  coordinates,
  places,
  setChildClicked,
}) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const mapRef = useRef(null);
  const [mapStyle, setMapStyle] = useState(MAP_STYLES[0]);
  const [showStyles, setShowStyles] = useState(false);
  const [viewport, setViewport] = useState({
    longitude: coordinates.lng || -68.8458,
    latitude: coordinates.lat || -32.8895,
    zoom: 14,
  });

  const onViewportChange = useCallback(
    (nextViewport) => {
      setViewport(nextViewport);
      setCoordinates({ lat: nextViewport.latitude, lng: nextViewport.longitude });
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        const bounds = map.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          setBounds({
            ne: { lat: ne.lat, lng: ne.lng },
            sw: { lat: sw.lat, lng: sw.lng },
          });
        }
      }
    },
    [setCoordinates, setBounds]
  );

  const handleMarkerClick = (place, index) => {
    setChildClicked(index);
  };

  return (
    <div className={classes.mapContainer}>
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={mapStyle.url}
        onViewportChange={onViewportChange}
        onLoad={() => {
          if (mapRef.current) {
            const map = mapRef.current.getMap();
            const bounds = map.getBounds();
            if (bounds) {
              const ne = bounds.getNorthEast();
              const sw = bounds.getSouthWest();
              setBounds({
                ne: { lat: ne.lat, lng: ne.lng },
                sw: { lat: sw.lat, lng: sw.lng },
              });
            }
          }
        }}
      >
        {places?.map((place, i) => (
          <Marker
            key={i}
            longitude={Number(place.longitude)}
            latitude={Number(place.latitude)}
            onClick={() => handleMarkerClick(place, i)}
          >
            {!isDesktop ? (
              <LocationOnOutlinedIcon color="primary" fontSize="large" />
            ) : (
              <Paper
                elevation={3}
                className={classes.paper}
                onClick={() => handleMarkerClick(place, i)}
              >
                <Typography
                  className={classes.typography}
                  variant="subtitle2"
                  gutterBottom
                >
                  {place.name}
                </Typography>
                <img
                  className={classes.pointer}
                  src={
                    place.photo
                      ? place.photo.images.large.url
                      : "https://divisare-res.cloudinary.com/images/dpr_3.0,f_auto,q_auto,w_200/v1655456381/ucqwhhp02jh7rhghbobg/sampling-madara-gritane-brewery-manufaktura.jpg"
                  }
                  alt={place.name}
                />
                <Rating size="small" value={Number(place.rating)} readOnly />
              </Paper>
            )}
          </Marker>
        ))}
      </ReactMapGL>

      {/* Style Switcher */}
      <div className={classes.styleSwitcher}>
        <div
          className={classes.styleButton}
          onClick={() => setShowStyles(!showStyles)}
        >
          <div className={classes.styleThumbMini} />
          <Typography variant="caption" className={classes.styleLabel}>
            Mapa
          </Typography>
        </div>

        {showStyles && (
          <Paper elevation={4} className={classes.stylePanel}>
            {MAP_STYLES.map((style) => (
              <div
                key={style.id}
                className={`${classes.styleOption} ${style.id === mapStyle.id ? classes.styleOptionActive : ""}`}
                onClick={() => {
                  setMapStyle(style);
                  setShowStyles(false);
                }}
              >
                <div className={`${classes.styleThumbPanel} ${classes[`thumb_${style.id}`]}`} />
                <Typography variant="caption">{style.label}</Typography>
              </div>
            ))}
          </Paper>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
