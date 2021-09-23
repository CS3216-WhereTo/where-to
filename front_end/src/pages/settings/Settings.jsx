import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { IonPage, IonContent, IonLabel, IonButton, IonChip } from "@ionic/react";
import { useGoogleLogout } from "react-google-login";

import Loading from '../../components/loading/Loading';
import CustomToast from "../../components/custom-toast/CustomToast";
import UnauthenticatedUserScreen from "../../components/sign-in/SignIn";
import checkUserLoggedIn, { signUserOut } from "../../utils/AuthChecker";
import { trackPageView, trackUpdateWalkingSpeedEvent, trackDismissSettingsToastEvent, trackGoogleSignOutEvent } from "../../utils/ReactGa";
import "./Settings.css";

// TODO
// Fix bug where sign out doesn't redirect

const Settings = ({ users }) => {
  const [ loggedIn, setLoginState ]  = useState(null);
  checkUserLoggedIn()
    .then((loggedIn) => {
      if (loggedIn) setLoginState(true);
      else setLoginState(false);
    })
    .catch(console.error);

  // Handling signouts
  const history = useHistory();

  const handleLogOut = () => {
    signUserOut();
    trackGoogleSignOutEvent();
    history.replace("/");
  };

  const handleLogOutFailure = () => {
    console.log("Encountered error logging out");
  };

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    onLogoutSuccess: handleLogOut,
    onFailure: handleLogOutFailure,
  });

  // Showing speed options
  const options = [
    {label: "Very Slow (0.8 m/s)", val: 0.8},
    {label: "Slow (1.1 m/s)", val: 1.1},
    {label: "Average (1.4 m/s)", val: 1.4},
    {label: "Fast (1.6 m/s)", val: 1.6},
    {label: "Very Fast (1.9 m/s)", val: 1.9},
  ];
  
  const [selectedSpeed, setSelectedSpeed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  useEffect(() => {
    users.onChangeSpeed(() => {
      const speed = users.getSpeed();
      setSelectedSpeed(speed);
      if (loading) setShowToast(true);
      setLoading(false);
    });

    users.fetchSpeed();
  }, [selectedSpeed]);

  const selectSpeed = (val) => {
    if (val === selectedSpeed) return;

    // Trigger api call to set new speed
    setLoading(true);
    users.setSpeed(val);

    trackUpdateWalkingSpeedEvent();
  };

  const getSpeedOptions = () => {
    const speedOption = ({label, val}, key) => {
      const selectionStyle = val === selectedSpeed ? "speed__option--selected" : "speed__option--unselected";
      return (
        <IonChip key={key} onClick={() => selectSpeed(val)} className={"speed__option " + selectionStyle} disabled={loading}>
          <IonLabel>{label}</IonLabel>
        </IonChip>
      );
    };

    return options.map(speedOption);
  };

  const signOutButton = (
    <IonButton className="sign-out__button" shape="round" onClick={signOut}>
      Sign Out
    </IonButton>
  );
  
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
          <div className="speed__options">{getSpeedOptions()}</div>
        </div>
        <div className="sign-out">{signOutButton}</div>
        <CustomToast
          showToast={showToast}
          setShowToast={setShowToast}
          toastMessage="👣 Your walking speed has been updated."
          dismissBtnHandler={trackDismissSettingsToastEvent}
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
