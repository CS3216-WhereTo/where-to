import { IonPage, IonIcon, IonButton } from "@ionic/react";
import { useState, useEffect, useRef } from "react";

import "./SearchHome.css";
import { ellipseOutline, swapVertical } from "ionicons/icons";
import { locationSharp } from "ionicons/icons";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { geolocated } from "react-geolocated";
import { useLocation } from "react-router-dom";

import CustomSelect from "../../components/custom-select/CustomSelect";

// store in process.env
mapboxgl.accessToken = "pk.eyJ1IjoidGVvanVueGlvbmciLCJhIjoiY2t0aTl0OGp6MHp3bjJ1cGlsdHhzODAwdSJ9.rujr8ESzMSG6u7pFL6OQ6A";

const SearchHome = (props) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [centeredAtCurrent, setCenteredAtCurrent] = useState(false);

  // Sets Node passed from FavouritesItem as end point
  let redirectProps = useLocation();
  useEffect(() => {
    setEnd(redirectProps?.state?.destination);
  }, [redirectProps]);

  const mapContainer = useRef(null);
  const map = useRef(null);

  // Defaults to NUS location if Geolocation permission not given
  const [lng, setLng] = useState(103.7764);
  const [lat, setLat] = useState(1.2956);
  const [zoom, setZoom] = useState(17);

  useEffect(() => {
    if (map.current) return;

    // Initialises new Map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [lng, lat],
      maxBounds: [
        [103.76543863073609, 1.287192070753754], // Southwest coordinates
        [103.78704066069248, 1.30695591620379], // Northeast coordinates
      ],
      zoom: zoom,
    });

    // Adds Geolocate control to Map, will be disabled if user blocks location service
    // Hide if not in bounds?
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        showAccuracyCircle: false,
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    // Adds Navigation control (zoom) to Map
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      })
    );

    // Use a splash screen to hide the resize
    map.current.once("load", () => {
      map.current.resize();
    });
  });

  useEffect(() => {
    // Wait for the Map to initialise
    if (!map.current) return;

    // Updates lng and lat when the Map is moved, not needed currently
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  // Dummy data
  const options = [
    { label: "Swedish", value: "sv" },
    { label: "NUS", value: "nus" },
    { label: "EnglishEnglishEnglish EnglishEnglishEnglishEnglishEnglish ", value: "en" },
  ];

  const swapStartEnd = () => {
    const temp = start;
    setStart(end);
    setEnd(temp);
  };

  return (
    <IonPage className="page search-home-page">
      <div className="search-header">
        <div className="search">
          <div className="search-container">
            <div className="start-search">
              <IonIcon slot="start" icon={ellipseOutline} size="medium"></IonIcon>

              <CustomSelect value={start} onChange={setStart} options={options} placeholder="Select a starting point" />
            </div>
            <div className="end-search">
              <IonIcon slot="start" icon={locationSharp} size="medium"></IonIcon>
              <CustomSelect value={end} onChange={setEnd} options={options} placeholder="Select a destination" />
            </div>
          </div>

          <div className="swap">
            <IonButton size="small" fill="clear" onClick={swapStartEnd}>
              <IonIcon slot="icon-only" icon={swapVertical} />
            </IonButton>
            <IonButton
              color="light"
              size="small"
              shape="round"
              onClick={() => {
                try {
                  map.current.removeLayer("route");
                  map.current.removeSource("route");
                } catch (e) {
                  // Map currently has no result plotted
                } finally {
                  // Polyline should be decoded before being received here, e.g. in gateway or store
                  map.current.addSource("route", {
                    type: "geojson",
                    data: {
                      type: "Feature",
                      properties: {},
                      geometry: {
                        type: "LineString",
                        coordinates: [
                          [1.29431, 103.7846],
                          [1.29442, 103.784],
                          [1.29444, 103.783],
                          [1.29525, 103.7827],
                          [1.29532, 103.7824],
                          [1.29614, 103.7823],
                          [1.29642, 103.7822],
                          [1.29654, 103.7818],
                        ].map((c) => [c[1], c[0]]),
                      },
                    },
                  });

                  // Different colours for walking and bus
                  // Maybe bus is dotted?
                  map.current.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: {
                      "line-join": "round",
                      "line-cap": "round",
                    },
                    paint: {
                      "line-color": "#3880FF",
                      "line-width": 4,
                    },
                  });

                  // Centers on start location
                  map.current.flyTo({ center: [103.7846, 1.29431] });
                }
              }}
            >
              <b>GO</b>
            </IonButton>
          </div>
        </div>
        <div className="search-button"></div>
      </div>

      <div ref={mapContainer} className="map map--fixed map--fullscreen" />
    </IonPage>
  );
};

// Wrapper for Geolocation API, related attributes can be accessed via props
export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(SearchHome);

// export default SearchHome;
