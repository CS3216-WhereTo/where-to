import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { IonPage, IonChip, IonIcon, IonLabel, IonButton } from "@ionic/react";
import { ellipseOutline, locationSharp, arrowBack, bus, walk } from "ionicons/icons";
import Sheet from "react-modal-sheet";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import polyline from "@mapbox/polyline";

import Modal from "../../components/modal/Modal";
import "./SearchResult.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

const walkDir = [
  { location: "XXX", type: "walk", duration: 10 },
  { location: "XXX", type: "walk", duration: 10 },
  { location: "XXX", type: "walk", duration: 10 },
  { location: "XXX", type: "walk", duration: 10 },
  { location: "XXX", type: "walk", duration: 10 },
  { location: "XXX", type: "walk", duration: 10 },
];

const busDir = [
  { location: "XXX", type: "walk", duration: 10 },
  { location: "XXX", type: "bus", duration: 10 },
  { location: "XXX", type: "walk", duration: 10 },
  { location: "XXX", type: "bus", duration: 10 },
  { location: "XXX", type: "walk", duration: 10 },
  { location: "XXX", type: "bus", duration: 10 },
  { location: "XXX", type: "walk", duration: 10 },
  { location: "XXX", type: "bus", duration: 10 },
  { location: "XXX", type: "walk", duration: 10 },
];

// TODO
// Add geolocation to track current location
// Pull route data and plot on map, and add markers for them

// Receive in start and end location
const SearchResult = () => {
  let redirectProps = useLocation();

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

  const parseBusRoute = useCallback((busRoute) => {
    const parsedData = {};
    parsedData.totalDistance = 0;
    parsedData.totalDuration = busRoute.total_duration;

    // { location: "XXX", type: "bus", duration: 10 },

    // decode polyline
    // parsedData.coordinates = polyline.decode(busRoute.polyline).map((coord) => [coord[1], coord[0]]);

    const directions = [];
    const coordinates = [];
    for (var i = 0; i < busRoute.segments.length; i++) {
      if (busRoute.segments[i].transport_type === "bus") {
        directions.push(...parseBusSegment(busRoute.segments[i]));

        coordinates.push(...polyline.decode(busRoute.segments[i].polyline).map((coord) => [coord[1], coord[0]]));
      } else {
        parsedData.totalDistance += Number(busRoute.segments[i].distance);
        directions.push(...parseWalkSegment(busRoute.segments[i]));

        coordinates.push(...polyline.decode(busRoute.segments[i].polyline).map((coord) => [coord[1], coord[0]]));
      }
    }
    parsedData.directions = directions;
    parsedData.coordinates = coordinates;
    setBusRoute(parsedData);
  }, []);

  const parseBusSegment = (busSegment) => {
    var locationString = "Take";

    for (var i = 0; i < busSegment.services.length; i++) {
      if (i === 0) {
        locationString += " bus ";
      }

      locationString += `${busSegment.services[0].code} (in ${Math.floor(busSegment.services[0].wait_time / 60)} min)`;

      if (i > 0 && i < busSegment.services.length - 1) {
        locationString += " or ";
      }
    }

    locationString += ` to ${busSegment.path.at(-1).name}`;
    return [{ location: locationString, type: "bus", duration: busSegment.duration, stops: busSegment.path.length }];
  };

  const parseWalkRoute = useCallback((walkRoute) => {
    const parsedData = {};
    parsedData.totalDistance = walkRoute.total_distance;
    parsedData.totalDuration = walkRoute.total_duration;

    // decode polyline
    parsedData.coordinates = polyline.decode(walkRoute.polyline).map((coord) => [coord[1], coord[0]]);
    parsedData.directions = parseWalkSegment(walkRoute);
    setWalkRoute(parsedData);
  }, []);

  const parseWalkSegment = (walkSegment) => {
    const directions = [];

    for (var i = 0; i < walkSegment.path.length; i++) {
      const node = walkSegment.path[i];
      directions.push({ location: `Walk to ${node.name}`, type: "walk", duration: node.duration ? node.duration : node.total_duration });
    }

    return directions;
  };

  // redirect is state is null or undef
  // Loading variable
  useEffect(() => {
    const state = redirectProps.state;
    console.log(state);
    if (!state) return;

    setStart(state.start);
    setEnd(state.end);
    parseWalkRoute(state.walk);
    parseBusRoute(state.bus);
  }, [parseBusRoute, parseWalkRoute, redirectProps]);

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

    map.current.once("load", () => {
      map.current.resize();
    });

    setTimeout(() => setMapLoading(false), 1500);
  }, [lng, lat, zoom]);

  useEffect(() => {
    if (mapLoading) return;
    console.log("mapmap");

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

    const start = dirType === "bus" ? busRoute.coordinates[0] : walkRoute.coordinates[0];
    const end = dirType === "bus" ? busRoute.coordinates.at(-1) : walkRoute.coordinates.at(-1);
    // Markers for start and end
    new mapboxgl.Marker().setLngLat(start).addTo(map.current);
    new mapboxgl.Marker().setLngLat(end).addTo(map.current);

    // Centers on start location
    map.current.flyTo({ center: start });
  }, [busRoute.coordinates, dirType, mapLoading, walkRoute.coordinates]);

  return (
    <IonPage className="page search-result-page">
      <div className="search-header">
        <div className="search-container">
          <div className="back-button">
            <Link to={{ pathname: "search" }}>
              <IonIcon className="back-button__icon" icon={arrowBack} />
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
                onClick={() => setDirType("bus")}
              >
                <IonIcon className={dirType === "bus" ? "search-option__icon--selected" : "search-option__icon--unselected"} icon={bus} />
                <IonLabel>{`${Math.floor(busRoute.totalDuration / 60)} min`}</IonLabel>
              </IonChip>

              <IonChip
                className={"search-option " + (dirType === "walk" ? "search-option--selected" : "search-option--unselected")}
                onClick={() => setDirType("walk")}
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
