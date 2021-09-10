import { IonPage, IonIcon, IonButton } from "@ionic/react";
import React, { useState, Component } from "react";
import GoogleMapReact from "google-map-react";
import "./SearchHome.css";
import Select from "react-select";
import { ellipseOutline, swapVertical } from "ionicons/icons";
import { locationSharp } from "ionicons/icons";

const SearchHome = (props) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const options = [
    { label: "Swedish", value: "sv" },
    { label: "English", value: "en" },
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
            <IonIcon slot="start" icon={swapVertical} size="medium"></IonIcon>
            <IonButton color="light" size="small">
              Go
            </IonButton>
          </div>
        </div>
        <div className="search-button"></div>
      </div>

      <div className="map map--fixed map--fullscreen">
        <GoogleMapReact
          bootstrapURLKeys={{ key: KEY }}
          defaultCenter={NUS_COORDS}
          defaultZoom={17}
          yesIWantToUseGoogleMapApiInternals
        ></GoogleMapReact>
      </div>
    </IonPage>
  );
};

const KEY = "AIzaSyBbsNRD5na97CAt0F7zzgN_jVeXHzHJbLI";
const NUS_COORDS = { lat: 1.2956, lng: 103.7764 };

export default SearchHome;