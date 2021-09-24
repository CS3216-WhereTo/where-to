import { useState, useEffect, useRef, useCallback } from "react";
import { IonPage, IonContent, IonLabel, IonButton, IonChip } from "@ionic/react";
import { Redirect } from "react-router";
import { useGoogleLogout } from "react-google-login";
import PropTypes from "prop-types";

import "./Settings.css";
import Loading from "../../components/loading/Loading";
import CustomToast from "../../components/custom-toast/CustomToast";
import userTokenExists, { signUserOut } from "../../utils/AuthChecker";
import UnauthenticatedUserScreen from "../../components/unauthenticated-screen/UnauthenticatedScreen";
import { trackPageView, trackUpdateWalkingSpeedEvent, trackDismissSettingsToastEvent, trackGoogleSignOutEvent } from "../../utils/ReactGa";
import UserStore from "../../stores/UserStore";

/**
 * Settings component
 */
const Settings = (props) => {
  const [loading, setLoading] = useState(true);
  const loggedIn = userTokenExists();
  const mounted = useRef(null);
  const [isLoggedOut, setLogoutState] = useState(false);

  /** @type {UserStore} */
  const user = props.user;

  const handleLogOut = () => {
    signUserOut();
    setLogoutState(true);
    trackGoogleSignOutEvent();
  };

  const handleLogOutFailure = () => {
    console.error("Encountered error logging out");
  };

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    onLogoutSuccess: () => handleLogOut(),
    onFailure: handleLogOutFailure,
  });

  // Showing speed options
  const options = [
    { label: "Very Slow (0.8 m/s)", val: 0.8 },
    { label: "Slow (1.1 m/s)", val: 1.1 },
    { label: "Average (1.4 m/s)", val: 1.4 },
    { label: "Fast (1.6 m/s)", val: 1.6 },
    { label: "Very Fast (1.9 m/s)", val: 1.9 },
  ];

  const [selectedSpeed, setSelectedSpeed] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [updating, setUpdateStatus] = useState(false);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  const updateSpeedSelection = useCallback(() => {
    console.log("SETTINGS: updateSpeedSelection() called");
    if (!mounted.current) return;

    const speed = user.getSpeed();
    setSelectedSpeed(speed);
    if (updating) setShowToast(true);
    setLoading(false);
    setUpdateStatus(false);
  }, [updating, user]);

  useEffect(() => {
    mounted.current = true;

    if (!loggedIn) {
      setLoading(false);
      return;
    }

    user.fetchSpeed(updateSpeedSelection);

    return () => {
      mounted.current = false;
    };
  }, [loggedIn, updateSpeedSelection, user]);

  const selectSpeed = (val) => {
    if (val === selectedSpeed) return;

    // Trigger api call to set new speed
    setUpdateStatus(true);
    user.setSpeed(val, updateSpeedSelection);

    trackUpdateWalkingSpeedEvent();
  };

  const getSpeedOptions = () => {
    const speedOption = ({ label, val }, key) => {
      const selectionStyle = val === selectedSpeed ? "speed__option--selected" : "speed__option--unselected";

      return (
        <IonChip key={key} onClick={() => selectSpeed(val)} className={"speed__option " + selectionStyle} disabled={updating || !navigator.onLine}>
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

  if (loading) return <Loading pageName={"Settings"} />;
  if (isLoggedOut) return <Redirect exact to="/" />;
  if (!loggedIn) return <UnauthenticatedUserScreen pageName={"Settings"} />;
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

Settings.propTypes = {
  user: PropTypes.instanceOf(UserStore),
};

export default Settings;
