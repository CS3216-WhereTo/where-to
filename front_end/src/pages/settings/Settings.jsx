import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { IonPage, IonContent, IonLabel, IonButton, IonChip } from "@ionic/react";
import { useGoogleLogout } from "react-google-login";

import CustomToast from "../../components/custom-toast/CustomToast";
import UnathenticatedUserScreen from "../../components/sign-in/SignIn";
import { signUserOut } from "../../utils/AuthChecker";
import { trackPageView, trackUpdateWalkingSpeedEvent, trackDismissSettingsToastEvent, trackGoogleSignOutEvent } from "../../utils/ReactGa";
import "./Settings.css";
import { useAuthContext } from "../../utils/Context";

// TODO
// Add API call for changing walking speed
// Add API call to init walking speed
// Fix bug where sign out doesn't redirect

const Settings = () => {
  const { isLoggedIn, setLoginState } = useAuthContext();

  const history = useHistory();

  const options = ["Very Slow (0.8 m/s)", "Slow (1.1 m/s)", "Average (1.4 m/s)", "Fast (1.6 m/s)", "Very Fast (1.9 m/s)"];

  // Showing speed options
  const [selectedSpeed, setSelectedSpeed] = useState(2);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  const handleLogOut = () => {
    signUserOut();
    setLoginState(false);
    history.push('/');
    trackGoogleSignOutEvent();
  };

  const handleLogOutFailure = () => {
    console.error("Encountered error logging out");
  };

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    onLogoutSuccess: handleLogOut,
    onFailure: handleLogOutFailure,
  });

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

  const getSpeedOptions = () => {
    const speedOption = (speed, key) => {
      const selectionStyle = key === selectedSpeed ? "speed__option--selected" : "speed__option--unselected";
      return (
        <IonChip key={key} onClick={() => selectSpeed(key)} className={"speed__option " + selectionStyle} disabled={loading}>
          <IonLabel>{speed}</IonLabel>
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

  if (!isLoggedIn) return <UnathenticatedUserScreen pageName={"Settings"} />;
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
