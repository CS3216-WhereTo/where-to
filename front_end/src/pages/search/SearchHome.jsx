import { IonPage, IonIcon, IonRippleEffect, IonToast } from "@ionic/react";
import { useState, useEffect, useRef } from "react";
import { ellipseOutline, swapVertical, locationSharp } from "ionicons/icons";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useLocation } from "react-router-dom";
import { geolocated } from "react-geolocated";

import "./SearchHome.css";
import CustomToast from "../../components/custom-toast/CustomToast";
import CustomSelect from "../../components/custom-select/CustomSelect";
import { trackPageView, trackDismissSearchToastEvent } from "../../utils/ReactGa";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

const SearchHome = (props) => {
  // Sets Node passed from FavouritesItem as end point
  let redirectProps = useLocation();

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(103.7764);
  const [lat, setLat] = useState(1.2956);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [zoom, setZoom] = useState(17);
  const [isInitiallyCentered, setIsInitiallyCentered] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [options, setOptions] = useState({});
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Check if there is a Node passed from FavouritesItem
  useEffect(() => {
    setEnd(redirectProps?.state?.destination);
  }, [redirectProps]);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  useEffect(() => {
    setOptionsLoading(true);
    props.nodes.onChange(() => {
      const favourites = props.nodes.getFavourites().map((node) => {
        return { label: node.name, value: { ...node, isFavourite: true } };
      });

      const nonFavourites = props.nodes.getNonFavourites().map((node) => {
        return { label: node.name, value: { ...node, isFavourite: false } };
      });
      setOptions([...favourites, ...nonFavourites]);
      setOptionsLoading(false);
    });

    props.nodes.fetchNodes();
  }, [props.nodes]);

  useEffect(() => {
    if (map.current) return;

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
    if (!props.coords) return;

    if (!isInitiallyCentered) {
      // Center the Map at user's current location, will only be done once
      map.current.flyTo({
        center: [props.coords.longitude, props.coords.latitude],
        essential: true,
      });
      setIsInitiallyCentered(true);
    }

    if (currentMarker) {
      currentMarker.setLngLat([props.coords.longitude, props.coords.latitude]);
    } else {
      const marker = new mapboxgl.Marker();
      marker.setLngLat([props.coords.longitude, props.coords.latitude]).addTo(map.current);

      setCurrentMarker(marker);
    }
  }, [currentMarker, isInitiallyCentered, props.coords]);

  const handleInputChange = (input) => {
    const displayOptions = options.filter((option) => {
      const words = option.label.toLowerCase().split(" ");
      for (const word of words) {
        if (word.startsWith(input)) {
          return true;
        }
      }
      return false;
    });

    setFilteredOptions(displayOptions);
  };

  const swapStartEnd = () => {
    const temp = start;
    setStart(end);
    setEnd(temp);
  };

  const submitSearch = () => {
    // Either field is empty
    if (!start || !end) {
      setToastMessage(`⚠️ Please indicate ${!start ? "a start" : "an end"} point.`);
      setShowToast(true);
      return;
    }

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

      // Markers for start and end
      new mapboxgl.Marker().setLngLat([103.7846, 1.29431]).addTo(map.current);
      new mapboxgl.Marker().setLngLat([103.7818, 1.29654]).addTo(map.current);

      // Centers on start location
      map.current.flyTo({ center: [103.7846, 1.29431] });
    }
  };

  return (
    <IonPage className="page search-home-page">
      <div className="search-header">
        <div className="search-container">
          <div className="search-inner-container">
            <div className="search-inner-container__content">
              <IonIcon className="search__icon" slot="start" icon={ellipseOutline} size="medium"></IonIcon>
              <CustomSelect
                className="search__input"
                value={start}
                onChange={setStart}
                options={filteredOptions}
                onInputChange={handleInputChange}
                disabled={optionsLoading}
                placeholder="Select a starting point"
              />
            </div>

            <div className="search-inner-container__content">
              <IonIcon className="search-inner-container__icon" slot="start" icon={locationSharp} size="medium"></IonIcon>
              <CustomSelect
                className="search-inner-container__input"
                value={end}
                onChange={setEnd}
                options={options}
                disabled={optionsLoading}
                placeholder="Select a destination"
              />
            </div>
          </div>

          <div className="search-buttons">
            <IonIcon className="search-buttons__icon" slot="icon-only" onClick={swapStartEnd} icon={swapVertical} />
            <p className="search-buttons__go ion-activatable" onClick={() => submitSearch()}>
              <b>GO</b>
              <IonRippleEffect></IonRippleEffect>
            </p>
          </div>
        </div>
      </div>

      <div ref={mapContainer} className="map map--fixed map--fullscreen" />
      <CustomToast showToast={showToast} setShowToast={setShowToast} toastMessage={toastMessage} dismissBtnHandler={trackDismissSearchToastEvent} />
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
