import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
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

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
mapboxgl.workerUrl = `https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl-csp-worker.js`;

const MapComponent = ({
  setCoordinates,
  setBounds,
  coordinates,
  places,
  setChildClicked,
}) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapStyle, setMapStyle] = useState(MAP_STYLES[0]);
  const [showStyles, setShowStyles] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle.url,
      center: [coordinates.lng || -68.8458, coordinates.lat || -32.8895],
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("move", () => {
      const center = map.current.getCenter();
      setCoordinates({ lat: center.lat, lng: center.lng });
    });

    map.current.on("moveend", () => {
      const bounds = map.current.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        setBounds({
          ne: { lat: ne.lat, lng: ne.lng },
          sw: { lat: sw.lat, lng: sw.lng },
        });
      }
    });
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle.url);
    }
  }, [mapStyle]);

  useEffect(() => {
    if (!map.current || !places) return;

    markers.current.forEach((m) => m.remove());
    markers.current = [];

    places.forEach((place, i) => {
      const el = document.createElement("div");

      if (!isDesktop) {
        el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#1976d2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>';
      } else {
        const imgSrc = place.photo
          ? place.photo.images.large.url
          : "https://divisare-res.cloudinary.com/images/dpr_3.0,f_auto,q_auto,w_200/v1655456381/ucqwhhp02jh7rhghbobg/sampling-madara-gritane-brewery-manufaktura.jpg";

        el.innerHTML = `
          <div style="background:white;padding:10px;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.3);width:100px;text-align:center;cursor:pointer;">
            <div style="font-size:12px;font-weight:500;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${place.name}</div>
            <img src="${imgSrc}" alt="${place.name}" style="width:100%;height:60px;object-fit:cover;border-radius:2px;" />
            <div style="margin-top:4px;color:#f5a623;font-size:12px;">★ ${Number(place.rating)}</div>
          </div>
        `;
      }

      el.style.cursor = "pointer";
      el.addEventListener("click", () => setChildClicked(i));

      const marker = new mapboxgl.Marker(el)
        .setLngLat([Number(place.longitude), Number(place.latitude)])
        .addTo(map.current);

      markers.current.push(marker);
    });
  }, [places, isDesktop, setChildClicked]);

  return (
    <div className={classes.mapContainer} ref={mapContainer}>
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
