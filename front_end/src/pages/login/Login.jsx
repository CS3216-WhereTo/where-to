import { useState, useEffect, useCallback } from "react";
import { GoogleLogin } from "react-google-login";
import { withRouter, useHistory } from "react-router-dom";
import { arrowForward } from "ionicons/icons";
import { IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonIcon } from "@ionic/react";

import "./Login.css";
import CustomToast from "../../components/custom-toast/CustomToast";
import { trackPageView, trackGuestSignInEvent, trackDismissLoginToastEvent } from "../../utils/ReactGa";
import userTokenExists, { signUserIn } from "../../utils/AuthChecker";
import Logo from "../../assets/logo.svg";
import SplashAnimation from "../../assets/splash-animation.gif";

const ERR_CON_GOOGLE = "We are unable to connect to Google right now, please try again later";
const ERR_AUTH_FAIL = "We are unable to authenticate you, please try again!";

/**
 * Login component
 */
function Login() {
  const history = useHistory();
  const redirectToSearch = useCallback(() => history.replace("/search"), [history]);

  const [loginError, setLoginError] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1500);
  }, []);

  useEffect(() => {
    trackPageView(window.location.pathname);

    const isLoggedIn = userTokenExists();
    if (isLoggedIn) {
      redirectToSearch();
    }
  }, [redirectToSearch]);

  /**
   * @param {import("react-google-login").GoogleLoginResponse} googleResponse
   */
  const handleGoogleLoginSuccess = (googleResponse) => {
    const token = googleResponse.tokenId;
    signUserIn(
      token,
      redirectToSearch,
      () => setLoginError(ERR_AUTH_FAIL),
      () => setLoginError(ERR_CON_GOOGLE)
    );
  };

  const handleGoogleLoginFailure = (response) => {
    console.log(`Login failed with error code ${response.error}: ${response.details}`);
    setLoginError(ERR_AUTH_FAIL);
  };

  /* Handler for guest logins */
  const handleGuestLogin = () => {
    trackGuestSignInEvent();
    history.push("/search");
  };

  const LoginHeaderRow = () => {
    return (
      <IonRow className="login__row login__row--top">
        <div className="app-info">
          <IonImg src={Logo} className="app-info__img" alt="logo" />
          <IonText className="app-info__text">
            <h2>
              <b>Travel around NUS</b>
            </h2>
          </IonText>
        </div>
      </IonRow>
    );
  };

  /* Helper function to initialise login buttons */
  const LoginOptionsRow = (props) => {
    const loginButton = (
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        onSuccess={props.onGoogleSuccess}
        onFailure={props.onGoogleFailure}
        theme="dark"
      />
    );

    const guestLoginButton = (
      <IonButton className="sns-login__button" shape="round" onClick={props.onGuestLogin}>
        <IonText className="sns-login__text">Continue as a guest</IonText>
        <IonIcon className="sns-login__next" slot="end" icon={arrowForward} size="large" />
      </IonButton>
    );

    return (
      <IonRow className="login__row login__row--bottom">
        <div className="auth">
          <div className="sns-login">
            <IonText className="sns-login__text">
              <h3>Continue with</h3>
            </IonText>

            <div className="login__row">{loginButton}</div>
          </div>

          <div className="auth-divider">
            <div className="auth-divider__line" />
            or
            <div className="auth-divider__line" />
          </div>

          <div className="sns-guest-login">{guestLoginButton}</div>
        </div>
      </IonRow>
    );
  };

  return (
    <IonPage className="page login-page">
      <div className={"splash " + (!showSplash ? "splash--hide" : "")}>
        <img src={SplashAnimation} alt="splash-animation" className="splash__img" />
      </div>
      <IonGrid className="login">
        <LoginHeaderRow />
        <LoginOptionsRow onGoogleSuccess={handleGoogleLoginSuccess} onGoogleFailure={handleGoogleLoginFailure} onGuestLogin={handleGuestLogin} />
      </IonGrid>
      <CustomToast
        showToast={loginError !== ""}
        setShowToast={() => setLoginError("")}
        toastMessage={loginError}
        dismissBtnHandler={() => trackDismissLoginToastEvent()}
      />
    </IonPage>
  );
}

export default withRouter(Login);
