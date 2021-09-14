import React, { useState } from 'react';
import Select from "react-select";

import { IonPage, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonLabel, IonButton } from "@ionic/react";

import './Settings.css';

const Settings = (props) => {
  const isSignedIn = true;
  const [speed, setSpeed] = useState(null);

  const options = [
    { label: "Very Slow (0.8 m/s)", value: "vs" },
    { label: "Slow (1.1 m/s)", value: "s" },
    { label: "Average (1.4 m/s)", value: "a" },
    { label: "Fast (1.6 m/s)", value: "f" },
    { label: "Very Fast (1.9 m/s)", value: "vf" },
  ]
  
  if (isSignedIn) {
    return (
      <IonPage className="page settings-page">
        <IonHeader className="settings-header">
          <IonToolbar>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
          <div className="speed">
            <IonLabel className="speed__label">Walking Speed</IonLabel>
            <div className="speed__select">
              <Select
                  value={speed}
                  onChange={setSpeed}
                  options={options}
                  placeholder="Select a walking speed"
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
              <IonButton className="speed__button" shape="round">Recalibrate</IonButton>
            </div>
          </div>
          <div className="sign-out">
            <IonButton className="sign-out__button" shape="round" href="./">Sign Out</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <IonPage className="page settings-page">
          <IonHeader className="settings-header">
            <IonToolbar>
              <IonTitle>Settings</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            <div className="sign-in">
                <div className="sign-in__label">
                      <IonLabel>You are not signed in.</IonLabel>
                </div>

                <div className="sign-in__button">
                    <IonButton shape="round" href="./">Sign In</IonButton>
                </div>
            </div>
        </IonContent>
      </IonPage>
    );
  }

};

export default Settings;
