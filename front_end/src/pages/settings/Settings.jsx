import { useState, useEffect } from "react";
import { useHistory } from 'react-router';
import { IonPage, IonContent, IonLabel, IonButton, IonChip, IonToast } from "@ionic/react";
import { useGoogleLogout } from 'react-google-login';

import Loading from '../../components/loading/Loading';
import UnauthenticatedUserScreen from '../../components/sign-in/SignIn';
import checkUserLoggedIn, { signUserOut } from '../../utils/AuthChecker';
import { trackPageView, trackUpdateWalkingSpeedEvent, trackDismissSettingsToastEvent,trackGoogleSignOutEvent } from "../../utils/ReactGa";
import './Settings.css';

const Settings = ({ users }) => {
  const [ loggedIn, setLoginState ]  = useState(null);
  checkUserLoggedIn()
    .then((loggedIn) => {
      if (loggedIn) setLoginState(true);
      else setLoginState(false);
    })
    .catch(console.error);
  
  const options = [
    {label: "Very Slow (0.8 m/s)", val: 0.8},
    {label: "Slow (1.1 m/s)", val: 1.1},
    {label: "Average (1.4 m/s)", val: 1.4},
    {label: "Fast (1.6 m/s)", val: 1.6},
    {label: "Very Fast (1.9 m/s)", val: 1.9},
  ];

  // Handling signouts
  const history = useHistory();

  function handleLogOut() {
    signUserOut();
    trackGoogleSignOutEvent();
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

  // Showing speed options
  const [selectedSpeed, setSelectedSpeed] = useState(1.4);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  useEffect(() => {
    users.onChangeSpeed(handler);

    users.fetchSpeed();
  }, []);

  const handler = () => {
    const speed = users.getSpeed();
    setSelectedSpeed(speed);
  }

  const selectSpeed = (val) => {
    if (val === selectedSpeed) return;

    // Trigger api call to set new speed
    setLoading(true);
    users.setSpeed(val);
    
    // Mimic API response time
    // setTimeout(() => {
    //   setLoading(false);
    //   setShowToast(true);
    // }, 2000);

    trackUpdateWalkingSpeedEvent();
    // Should disable all options until API call is complete
  };

  function getSpeedOptions() {

    function speedOption({label, val}, key) {
      const selectionStyle = (val === selectedSpeed)
        ? "speed__option--selected" 
        : "speed__option--unselected";
      return (
        <IonChip 
          key={key}
          onClick={() => selectSpeed(val)}
          className={"speed__option " + selectionStyle}
        >
          <IonLabel>{label}</IonLabel>
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

  const toast = () => {
    const dismissBtn = {
      text: "Okay",
      role: "cancel",
      handler: trackDismissSettingsToastEvent
    };
    return (
        <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={"Your walking speed has been updated. 👣👣👣"}
            position={'top'}
            duration={2000}
            buttons={[dismissBtn]}
        />
    );
  };
  
  if (loggedIn === null) return (<Loading pageName={"Settings"}/>);
  if (!loggedIn) return (<UnauthenticatedUserScreen pageName={"Settings"}/>);
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
        {toast()}
      </IonContent>
    </IonPage>
  );
};

export default Settings;
