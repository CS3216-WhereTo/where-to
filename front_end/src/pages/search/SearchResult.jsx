import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import Draggable from "react-draggable";

import { IonPage, IonChip, IonIcon, IonLabel, IonList, IonItem } from "@ionic/react";
import { ellipseOutline, locationSharp, arrowBack, bus, walk, chevronDownOutline, chevronUpOutline } from "ionicons/icons";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import "./SearchResult.css";

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
  });

  const tempWalk = [
    { location: "XXX", type: "walk", duration: 10 },
    { location: "XXX", type: "walk", duration: 10 },
    { location: "XXX", type: "walk", duration: 10 },
    { location: "XXX", type: "walk", duration: 10 },
    { location: "XXX", type: "walk", duration: 10 },
    { location: "XXX", type: "walk", duration: 10 },
  ];

  const tempBus = [
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

  const [walkDir, setWalkDir] = useState(tempWalk);
  const [busDir, setBusDir] = useState(tempBus);
  const [dirType, setDirType] = useState("bus");

  const [isDragging, setIsDragging] = useState(true);
  const [showDropDown, setShowDropDown] = useState(false);

  const toggleDropDown = () => {
    console.log(showDropDown);
    setShowDropDown(!showDropDown);
  };

  const onDrop = () => {};

  const onDrag = () => {
    setIsDragging(true);
  };

  const onStop = () => {
    const dragging = isDragging;
    setIsDragging(false);
    if (dragging) {
      onDrop();
    } else {
      toggleDropDown();
    }
  };

  // To get rid of warning
  const nodeRef = React.useRef(null);

  return (
    <IonPage className="page search-result-page">
      <div className="search-header">
        <div className="search">
          <div className="search-back">
            <Link to={{ pathname: "search", state: { destination: { label: "NUS", value: "nus" } } }}>
              <IonIcon icon={arrowBack}></IonIcon>
            </Link>
          </div>
          <div className="search-container">
            <div className="search-box">
              <div className="start-search">
                <IonIcon slot="start" icon={ellipseOutline} size="medium"></IonIcon>
                <div className="search__box">
                  <p className="search__text">Some Start Location</p>
                </div>
              </div>
              <div className="end-search">
                <IonIcon slot="start" icon={locationSharp} size="medium"></IonIcon>
                <div className="search__box">
                  <p className="search__text">Some End Location</p>
                </div>
              </div>
            </div>
            <div className="search-options">
              <IonChip style={dirType === "bus" ? { backgroundColor: "lightblue" } : {}} onClick={() => setDirType("bus")}>
                <IonIcon icon={bus} />
                <IonLabel>50 min</IonLabel>
              </IonChip>
              <IonChip style={dirType === "walk" ? { backgroundColor: "lightblue" } : {}} onClick={() => setDirType("walk")}>
                <IonIcon icon={walk} />
                <IonLabel>50 min</IonLabel>
              </IonChip>
            </div>
          </div>
        </div>
      </div>

      <div className="draggable-parent">
        <Draggable onDrag={onDrag} onStop={onStop} axis="y" nodeRef={nodeRef} bounds="parent">
          <div ref={nodeRef} className="modal">
            <hr className="modal__line" />
            <IonList lines="full" className="modal__content">
              <IonItem>
                <p className="modal__header">15 mins (1.5 km)</p>
              </IonItem>
              <div className="modal__list--scroll">
                {dirType === "bus"
                  ? busDir.map((elem, i) => {
                      if (elem.type === "bus") {
                        return (
                          <div key={i}>
                            <IonItem className="directions" lines={showDropDown ? "none" : "full"}>
                              <IonIcon className="directions__icon" icon={bus} />
                              <div className="directions__bus-text">
                                <p className="directions__text">Take bus to {elem.location}</p>
                                <div className="directions__dropdown">
                                  <p className="directions__dropdown-text">Ride XXX stops</p>
                                  <IonIcon className="directions__dropdown-icon" icon={showDropDown ? chevronUpOutline : chevronDownOutline} />
                                </div>
                              </div>
                              <IonLabel className="directions__time" slot="end">
                                {parseInt(elem.duration)} min
                              </IonLabel>
                            </IonItem>
                            <IonItem className={"dropdown " + (showDropDown ? "dropdown--visible" : "dropdown--hidden")}>
                              <div className="dropdown__list">
                                <p className="dropdown__text">Test</p>
                                <p className="dropdown__text">Test</p>
                                <p className="dropdown__text">Test</p>
                                <p className="dropdown__text">Test</p>
                              </div>
                            </IonItem>
                          </div>
                        );
                      } else {
                        return (
                          <IonItem className="directions" key={i}>
                            <IonIcon className="directions__icon" icon={walk}></IonIcon>
                            <p className="directions__text">Walk to {elem.location}</p>
                            <IonLabel className="directions__time" slot="end">
                              {parseInt(elem.duration)} min
                            </IonLabel>
                          </IonItem>
                        );
                      }
                    })
                  : walkDir.map((elem, i) => {
                      return (
                        <IonItem key={i}>
                          <IonIcon className="directions__icon" icon={walk}></IonIcon>
                          <p className="directions__text">Walk to {elem.location}</p>
                          <IonLabel className="directions__time" slot="end">
                            {parseInt(elem.duration)} min
                          </IonLabel>
                        </IonItem>
                      );
                    })}
              </div>
            </IonList>
          </div>
        </Draggable>
      </div>

      <div ref={mapContainer} className="map map--fixed map--fullscreen" />
    </IonPage>
  );
};

export default SearchResult;
