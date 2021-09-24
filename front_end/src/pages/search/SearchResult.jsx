import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { IonPage, IonChip, IonIcon, IonLabel, IonButton } from "@ionic/react";
import { ellipseOutline, locationSharp, arrowBack, bus, walk } from "ionicons/icons";
import Sheet from "react-modal-sheet";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import Modal from "../../components/modal/Modal";
import "./SearchResult.css";
import { parseBusRoute, parseWalkRoute } from "../../utils/ParseRoute";
import { trackPageView, trackSetDirectionTypeToBus, trackSetDirectionTypeToWalk, trackSearchResultBackPressEvent } from "../../utils/ReactGa";
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

// TODO
// Add geolocation to track current location
// Pull route data and plot on map, and add markers for them

// Receive in start and end location
const SearchResult = () => {
  let redirectProps = useLocation();
  let history = useHistory();

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  // Defaults to NUS location if Geolocation permission not given
  const [lng, setLng] = useState(103.7764);
  const [lat, setLat] = useState(1.2956);
  const [zoom, setZoom] = useState(17);
  const [dirType, setDirType] = useState("bus");
  const [isOpen, setOpen] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const [busRoute, setBusRoute] = useState({ totalDistance: 0, totalDuration: 0 });
  const [walkRoute, setWalkRoute] = useState({ totalDistance: 0, totalDuration: 0 });

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  useEffect(() => {
    const state = redirectProps.state;
    if (!state) {
      history.replace("/search");
      return;
    }

    setStart(state.start);
    setEnd(state.end);
    setWalkRoute(parseWalkRoute(state.walk));
    setBusRoute(parseBusRoute(state.bus));
  }, [history, redirectProps]);

  useEffect(() => {
    if (map.current) return;
    setMapLoading(true);

    // Initialises new Map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [lng, lat],
      maxBounds: [
        [103.59364428182482, 1.2118245793229845], // Southwest coordinates
        [104.03997620235008, 1.4679048601977227], // Northeast coordinates
      ],
      zoom: zoom,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        zoom: zoom,
      },
      showAccuracyCircle: false,
      trackUserLocation: true,
      showUserHeading: true,
    });

    // Adds Geolocate control to Map, will be disabled if user blocks location service
    map.current.addControl(geolocate);

    // Adds Navigation control (zoom) to Map
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      })
    );

    map.current.once("load", () => {
      map.current.resize();
      geolocate.trigger();
      setTimeout(() => setMapLoading(false), 1500);
    });
  }, [lng, lat, zoom]);

  useEffect(() => {
    if (mapLoading || !start || !end || !busRoute.coordinates || !walkRoute.coordinates) return;

    var mapLayer = map.current.getLayer("route");

    if (typeof mapLayer !== "undefined") {
      // Remove map layer & source.
      map.current.removeLayer("route");
      map.current.removeSource("route");
    }

    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: dirType === "bus" ? busRoute.coordinates : walkRoute.coordinates,
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

    const startCoordinates = dirType === "bus" ? busRoute.coordinates[0] : walkRoute.coordinates[0];
    const endCoordinates = dirType === "bus" ? busRoute.coordinates.at(-1) : walkRoute.coordinates.at(-1);

    // Markers for start and end
    new mapboxgl.Marker({ color: "#1B4571" })
      .setLngLat(startCoordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(` <p>${start?.label}</p>`)
      )
      .addTo(map.current);
    new mapboxgl.Marker({ color: "#b40219" })
      .setLngLat(endCoordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(` <p>${end?.label}</p>`)
      )
      .addTo(map.current);

    // Centers on start location
    map.current.flyTo({ center: startCoordinates, zoom: zoom });
  }, [busRoute.coordinates, dirType, end, mapLoading, start, walkRoute.coordinates, zoom]);

  return (
    <IonPage className="page search-result-page">
      <div className="search-header">
        <div className="search-container">
          <div className="back-button">
            <Link to={{ pathname: "search" }}>
              <IonIcon className="back-button__icon" icon={arrowBack} onClick={() => trackSearchResultBackPressEvent()} />
            </Link>
          </div>
          <div className="search-inner-container">
            <div className="search-inner-container__content">
              <IonIcon className="search-inner-container__icon" slot="start" icon={ellipseOutline} size="medium" />
              <div className="search-box">
                <p className="search-box__text">{start ? start.label : "Loading..."}</p>
              </div>
            </div>
            <div className="search-inner-container__content">
              <IonIcon className="search-inner-container__icon" slot="start" icon={locationSharp} size="medium" />
              <div className="search-box">
                <p className="search-box__text">{end ? end.label : "Loading..."}</p>
              </div>
            </div>

            <div className="search-options">
              <IonChip
                className={"search-option " + (dirType === "bus" ? "search-option--selected" : "search-option--unselected")}
                onClick={() => {
                  setDirType("bus");
                  trackSetDirectionTypeToBus();
                }}
              >
                <IonIcon className={dirType === "bus" ? "search-option__icon--selected" : "search-option__icon--unselected"} icon={bus} />
                <IonLabel>{`${Math.floor(busRoute.totalDuration / 60)} min`}</IonLabel>
              </IonChip>

              <IonChip
                className={"search-option " + (dirType === "walk" ? "search-option--selected" : "search-option--unselected")}
                onClick={() => {
                  setDirType("walk");
                  trackSetDirectionTypeToWalk();
                }}
              >
                <IonIcon className={dirType === "walk" ? "search-option__icon--selected" : "search-option__icon--unselected"} icon={walk} />
                <IonLabel>{`${Math.floor(walkRoute.totalDuration / 60)} min`}</IonLabel>
              </IonChip>
            </div>
          </div>
        </div>
      </div>

      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <Modal
              dirType={dirType}
              busDir={busRoute.directions}
              walkDir={walkRoute.directions}
              busDuration={Math.floor(busRoute.totalDuration / 60)}
              busDistance={busRoute.totalDistance / 1000}
              walkDuration={Math.floor(walkRoute.totalDuration / 60)}
              walkDistance={walkRoute.totalDistance / 1000}
            />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>

      <div className="directions-button--center">
        <IonButton className="directions-button" shape="round" onClick={() => setOpen(true)}>
          {dirType === "bus"
            ? `Directions (${busRoute.totalDistance / 1000} km, ${Math.floor(busRoute.totalDuration / 60)} min)`
            : `Directions (${walkRoute.totalDistance / 1000} km, ${Math.floor(walkRoute.totalDuration / 60)} min)`}
        </IonButton>
      </div>

      <div ref={mapContainer} className="map map--fixed map--fullscreen" />
    </IonPage>
  );
};

export default SearchResult;
