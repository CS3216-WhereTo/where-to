import { IonPage, IonIcon } from "@ionic/react";
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react'
import "./SearchHome.css";
import Select from "react-select";
import { ellipseOutline, swapVertical } from "ionicons/icons";
import { locationSharp } from "ionicons/icons";

const SearchHome = (props) => {
  const options = [
    { label: "Swedish", value: "sv" },
    { label: "English", value: "en" },
  ];

  return (
    <IonPage>
      <div className="search">
        <div className="search-container">
          <div className="start-search">
            <IonIcon slot="start" icon={ellipseOutline} size="large"></IonIcon>
            <Select
              value={options[0]}
              onChange={ console.log }
              options={options}
              styles={{
                container: (provided, state) => ({
                  ...provided,
                  display: "flex",
                  flex: 1,
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
            <IonIcon slot="start" icon={locationSharp} size="large"></IonIcon>
            <Select
              value={options[0]}
              onChange={ console.log }
              options={options}
              styles={{
                container: (provided, state) => ({
                  ...provided,
                  display: "flex",
                  flex: 1,
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
          <IonIcon slot="start" icon={swapVertical} size="large"></IonIcon>
        </div>
      </div>
    </IonPage>
  );
};

const KEY = 'AIzaSyBbsNRD5na97CAt0F7zzgN_jVeXHzHJbLI';
const NUS_COORDS = { lat: 1.2956, lng: 103.7764 };

export default class MapView extends Component {
  render() {
      console.log(this.props);
      return (
          <div className="map map--fixed map--fullscreen">
              <GoogleMapReact
                  bootstrapURLKeys={{ key: KEY }}
                  defaultCenter={ NUS_COORDS }
                  defaultZoom={ 17 }
                  yesIWantToUseGoogleMapApiInternals
              >
                <SearchHome/>
              </GoogleMapReact>
          </div>
      );
  }
}

MapView.defaultProps = {
  defaultCenter: NUS_COORDS,
  defaultZoom: 17
}
