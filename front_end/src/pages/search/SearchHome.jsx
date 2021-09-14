import { IonPage, IonIcon, IonButton } from "@ionic/react";
import React, { useState, useEffect, useRef } from "react";

import "./SearchHome.css";
import Select from "react-select";
import { ellipseOutline, swapVertical } from "ionicons/icons";
import { locationSharp } from "ionicons/icons";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { geolocated } from "react-geolocated";
import Option from "../../components/option/Option";

mapboxgl.accessToken = "pk.eyJ1IjoidGVvanVueGlvbmciLCJhIjoiY2t0aTl0OGp6MHp3bjJ1cGlsdHhzODAwdSJ9.rujr8ESzMSG6u7pFL6OQ6A";

const SearchHome = (props) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [centeredAtCurrent, setCenteredAtCurrent] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
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
        [103.59168954859202, 1.2059100797737556], // Southwest coordinates
        [104.04150066935574, 1.4850806496446494], // Northeast coordinates
      ],
      zoom: zoom,
    });

    // Adds Geolocate control to Map, will be disabled if user blocks location service
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
  });

  useEffect(() => {
    // State to ensure that Map does not fly everytime user's location changes
    if (centeredAtCurrent) return;
    if (!props.coords) return;

    // Center the Map at user's current location, will only be done once
    map.current.flyTo({
      center: [props.coords.longitude, props.coords.latitude],
      essential: true,
    });
    setCenteredAtCurrent(true);
  }, [centeredAtCurrent, props.coords]);

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
    { label: "EnglishEnglishEnglish EnglishEnglishEnglishEnglishEnglish ", value: "en" },
  ];

  return (
    <IonPage className="page search-home-page">
      <div className="search-header">
        <div className="search">
          <div className="search-container">
            <div className="start-search">
              <IonIcon slot="start" icon={ellipseOutline} size="medium"></IonIcon>

              <Select
                value={start}
                onChange={setStart}
                options={options}
                isClearable={true}
                components={{ Option }}
                placeholder="Select a starting point"
                styles={{
                  container: (provided, state) => ({
                    ...provided,
                    display: "flex",
                    flex: 1,
                    marginLeft: "8px",
                    marginRight: "8px",
                  }),
                  control: (provided, state) => ({
                    ...provided,
                    display: "flex",
                    flex: 1,
                  }),
                }}
              />
            </div>
            <div className="end-search">
              <IonIcon slot="start" icon={locationSharp} size="medium"></IonIcon>
              <Select
                value={end}
                onChange={setEnd}
                options={options}
                isClearable={true}
                components={{ Option }}
                placeholder="Select a destination"
                styles={{
                  container: (provided, state) => ({
                    ...provided,
                    display: "flex",
                    flex: 1,
                    marginLeft: "8px",
                    marginRight: "8px",
                  }),
                  control: (provided, state) => ({
                    ...provided,
                    display: "flex",
                    flex: 1,
                  }),
                }}
              />
            </div>
          </div>

          <div className="swap">
            <IonButton size="small" fill="clear">
              <IonIcon slot="icon-only" icon={swapVertical} />
            </IonButton>
            <IonButton color="light" size="small">
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
