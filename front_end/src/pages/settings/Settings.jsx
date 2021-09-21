import { useState, useEffect } from "react";
import { useHistory } from 'react-router';
import { IonPage, IonContent, IonLabel, IonButton, IonChip, IonToast } from "@ionic/react";
import { useGoogleLogout } from 'react-google-login';

import UnathenticatedUserScreen from '../../components/sign-in/SignIn';
import userIsLoggedIn, { getUserToken, signUserOut } from '../../utils/AuthChecker';
import { trackPageView, trackUpdateWalkingSpeedEvent, trackDismissSettingsToastEvent,trackGoogleSignOutEvent } from "../../utils/ReactGa";
import './Settings.css';

const Settings = () => {

  const options = ["Very Slow (0.8 m/s)", "Slow (1.1 m/s)", "Average (1.4 m/s)", "Fast (1.6 m/s)", "Very Fast (1.9 m/s)"];

  const history = useHistory();

  function handleLogOut() {
    signUserOut();
    history.replace('/');
  }

  function handleLogOutFailure() {
    console.log('Encountered error logging out')
  }

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    onLogoutSuccess: handleLogOut,
    onFailure: handleLogOutFailure
  });

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

  function getSpeedOptions() {

    function speedOption(speed, key) {
      const selectionStyle = (key === selectedSpeed)
        ? "speed__option--selected" 
        : "speed__option--unselected";
      return (
        <IonChip 
          key={key}
          onClick={() => selectSpeed(key)}
          className={"speed__option " + selectionStyle}
        >
          <IonLabel>{speed}</IonLabel>
        </IonChip>
      );
    }

    return options.map(speedOption);
  }

  const speedOptions = getSpeedOptions();

  const signOutButton = (
    <IonButton
      className="sign-out__button" 
      shape="round" 
      onClick={signOut}
    >
      Sign Out
    </IonButton>
  )

  if (!userIsLoggedIn()) return (<UnathenticatedUserScreen pageName={"Settings"}/>);
  return (
    <IonPage className="page settings-page">
      <div className="page-header">
        <p className="page-header__text">Settings</p>
      </div>

      <IonContent>
        <div className="speed">
          <p className="speed__text">Walking Speed</p>
          <div className="speed__options">{speedOptions}</div>
        </div>
        <div className="sign-out">{signOutButton}</div>
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
