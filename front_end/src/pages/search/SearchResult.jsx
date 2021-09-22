import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { IonPage, IonChip, IonIcon, IonLabel, IonButton } from "@ionic/react";
import { ellipseOutline, locationSharp, arrowBack, bus, walk } from "ionicons/icons";

import Sheet from 'react-modal-sheet'

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import Modal from '../../components/modal/Modal'
import "./SearchResult.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

// Receive in start and end location
const SearchResult = ({ start, end }) => {
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
    map.current.once("load", () => {
      map.current.resize();
    });
  });

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

  const [dirType, setDirType] = useState("bus");

  const [isOpen, setOpen] = useState(false);

  return (
    <IonPage className="page search-result-page">
      <div className="search-header">
        <div className="search-container">
          <div className="back-button">
            <Link to={{ pathname: "search", state: { destination: { label: "NUS", value: "nus" } } }}>
              <IonIcon className="back-button__icon" icon={arrowBack} />
            </Link>
          </div>
          <div className="search-inner-container">
            <div className="search-inner-container__content">
              <IonIcon className="search-inner-container__icon" slot="start" icon={ellipseOutline} size="medium" />
              <div className="search-box">
                <p className="search-box__text">Some Start Location</p>
              </div>
            </div>
            <div className="search-inner-container__content">
              <IonIcon className="search-inner-container__icon" slot="start" icon={locationSharp} size="medium" />
              <div className="search-box">
                <p className="search-box__text">Some End Location</p>
              </div>
            </div>
            <div className="search-options">
              <IonChip 
                className={"search-option " + (dirType === "bus" ? "search-option--selected" : "search-option--unselected")} 
                onClick={() => setDirType("bus")}>
                <IonIcon
                  className={dirType === "bus" ? "search-option__icon--selected" : "search-option__icon--unselected"} 
                  icon={bus} />
                <IonLabel>50 min</IonLabel>
              </IonChip>
              <IonChip 
                className={"search-option " + (dirType === "walk" ? "search-option--selected" : "search-option--unselected")} 
                onClick={() => setDirType("walk")}>
                <IonIcon 
                  className={dirType === "walk" ? "search-option__icon--selected" : "search-option__icon--unselected"} 
                  icon={walk} />
                <IonLabel>50 min</IonLabel>
              </IonChip>
            </div>
          </div>
        </div>
      </div>

        <Sheet 
          isOpen={isOpen} 
          onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <Modal dirType={dirType} busDir={busDir} walkDir={walkDir} />
          </Sheet.Content>
          </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>

      <div className="directions-button--center">
        <IonButton 
          className="directions-button" 
          shape="round" 
          onClick={() => setOpen(true)}>
            Directions (1.5km, 15 mins)
        </IonButton>
      </div>

      <div ref={mapContainer} className="map map--fixed map--fullscreen" />
    </IonPage>
  );
};

export default SearchResult;
