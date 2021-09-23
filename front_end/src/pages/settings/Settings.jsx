import { useState, useEffect, useRef } from "react";
import { IonPage, IonContent, IonLabel, IonButton, IonChip } from "@ionic/react";
import { useGoogleLogout } from "react-google-login";
import PropTypes from "prop-types"

import Loading from '../../components/loading/Loading';
import CustomToast from "../../components/custom-toast/CustomToast";
import { signUserOut } from "../../utils/AuthChecker";
import UnauthenticatedUserScreen from "../../components/sign-in/SignIn";
import { trackPageView, trackUpdateWalkingSpeedEvent, trackDismissSettingsToastEvent, trackGoogleSignOutEvent } from "../../utils/ReactGa";
import "./Settings.css";
import { useAuthContext } from "../../utils/Context";
import UserStore from "../../stores/UserStore";
import { Redirect } from "react-router";

function Settings(props) {

  const [ loading, setLoading ] = useState(true);
  const { isLoggedIn, setLoginState } = useAuthContext();
  const mounted = useRef(null);
  const [ assignedObserver, setObserveStatus ] = useState(false);
  const [ isLoggedOut, setLogoutState ] = useState(false);

  /** @type {UserStore} */
  const user = props.user

  const handleLogOut = () => {
    signUserOut();
    setLoginState(false);
    setLogoutState(true);
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

  // Showing speed options
  const options = [
    {label: "Very Slow (0.8 m/s)", val: 0.8},
    {label: "Slow (1.1 m/s)", val: 1.1},
    {label: "Average (1.4 m/s)", val: 1.4},
    {label: "Fast (1.6 m/s)", val: 1.6},
    {label: "Very Fast (1.9 m/s)", val: 1.9},
  ];
  
  const [selectedSpeed, setSelectedSpeed] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [updating, setUpdateStatus] = useState(false);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  function updateSpeedSelection() {
    if (!mounted.current) return;

    const speed = user.getSpeed();
    setSelectedSpeed(speed);
    if (updating) setShowToast(true);
    setLoading(false);
    setUpdateStatus(false);
  }

  useEffect(() => {
    mounted.current = true;
    console.log('I got mounted');

    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    if (!assignedObserver) {
      user.onChangeSpeed(updateSpeedSelection);
      setObserveStatus(true);
    }
    user.fetchSpeed();

    return () => { mounted.current = false };
  }, []);

  function selectSpeed(val) {
    if (val === selectedSpeed) return;

    // Trigger api call to set new speed
    setUpdateStatus(true);
    user.setSpeed(val);

    trackUpdateWalkingSpeedEvent();
  };

  function getSpeedOptions() {
    const speedOption = ({label, val}, key) => {
      const selectionStyle = val === selectedSpeed ? "speed__option--selected" : "speed__option--unselected";
      return (
        <IonChip
          key={key}
          onClick={() => selectSpeed(val)}
          className={"speed__option " + selectionStyle}
          disabled={updating}
        >
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


  if (loading) return (<Loading pageName={"Settings"}/>);
  if (isLoggedOut) return (<Redirect exact to='/'/>);
  else if (!isLoggedIn) return (<UnauthenticatedUserScreen pageName={"Settings"}/>);
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
  user: PropTypes.instanceOf(UserStore)
};

export default Settings;
