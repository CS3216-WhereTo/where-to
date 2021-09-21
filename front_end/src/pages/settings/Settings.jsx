import { useState, useEffect } from "react";

import { IonPage, IonContent, IonLabel, IonButton, IonChip, IonToast } from "@ionic/react";

import SignIn from "../../components/sign-in/SignIn";
import "./Settings.css";
import { trackPageView, trackUpdateWalkingSpeedEvent, trackDismissSettingsToastEvent,trackGoogleSignOutEvent } from "../../utils/ReactGa";

const Settings = (props) => {
  const isSignedIn = true;

  const options = ["Very Slow (0.8 m/s)", "Slow (1.1 m/s)", "Average (1.4 m/s)", "Fast (1.6 m/s)", "Very Fast (1.9 m/s)"];

  const [selectedSpeed, setSelectedSpeed] = useState(2);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  const selectSpeed = (i) => {
    if (i === selectedSpeed) return;

    // Trigger api call to set new speed
    setLoading(true);

    // Mimic API response time
    setTimeout(() => {
      setLoading(false);
      setShowToast(true);
    }, 2000);

    setSelectedSpeed(i);
    trackUpdateWalkingSpeedEvent();
    // Should disable all options until API call is complete
  };

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
            {options.map((speed, i) => {
              return (
                <IonChip
                  key={i}
                  onClick={() => selectSpeed(i)}
                  disabled={loading}
                  className={"speed__option " + (i === selectedSpeed ? "speed__option--selected" : "speed__option--unselected")}
                >
                  <IonLabel>{speed}</IonLabel>
                </IonChip>
              );
            })}
          </div>
        </div>

        <div className="sign-out" onClick={trackGoogleSignOutEvent}>
          <IonButton className="sign-out__button" shape="round" routerLink="/" routerDirection="root">
            Sign Out
          </IonButton>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Your walking speed has been updated. 👣👣👣"
          position="top"
          duration={2000}
          buttons={[
            {
              text: "Okay",
              role: "cancel",
              handler: () => {
                trackDismissSettingsToastEvent();
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
