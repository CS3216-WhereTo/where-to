import { useState } from 'react';

import { IonPage, IonContent, IonLabel, IonButton, IonChip } from "@ionic/react";

import SignIn from '../../components/sign-in/SignIn';
import './Settings.css';

const Settings = (props) => {
  const isSignedIn = true;

  const options = [
    "Very Slow (0.8 m/s)", 
    "Slow (1.1 m/s)", 
    "Average (1.4 m/s)", 
    "Fast (1.6 m/s)", 
    "Very Fast (1.9 m/s)"
  ]

  const [selectedSpeed, setSelectedSpeed] = useState(2);

  const selectSpeed = (i) => {
    // Trigger api call to set new speed
    setSelectedSpeed(i);
  }
  
  if (!isSignedIn) {
    return (
      <IonPage className="page settings-page">
        <div className="page-header">
          <p className="page-header__text">Settings</p>
        </div>

        <IonContent>
          <SignIn />
        </IonContent>
      </IonPage>
    );
  }
  return (
    <IonPage className="page settings-page">
      <div className="page-header">
        <p className="page-header__text">Settings</p>
      </div>
      
      <IonContent>
        <div className="speed">
          <p className="speed__text">Walking Speed</p>
          <div className="speed__options">
          {
            options.map((speed, i) => {
              return (
                <IonChip 
                  key={i}
                  onClick={() => selectSpeed(i)}
                  className={"speed__option " + (i === selectedSpeed ? "speed__option--selected" : "speed__option--unselected")}
                >
                  <IonLabel>{speed}</IonLabel>
                </IonChip>
              );
            })
          }
          </div>
        </div>
        <div className="sign-out">
          <IonButton className="sign-out__button" shape="round" href="./">Sign Out</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
