import { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { withRouter, useHistory } from "react-router-dom";
import { arrowForward } from "ionicons/icons";
import { IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonIcon } from "@ionic/react";

import "./Login.css";
import CustomToast from "../../components/custom-toast/CustomToast";
import { trackPageView, trackGuestSignInEvent, trackDismissLoginToastEvent } from "../../utils/ReactGa";
import { signUserIn } from "../../utils/AuthChecker";
import { useUserLoggedIn } from "../../context/UserContext";
import Logo from "../../assets/logo.svg";

const ERR_CON_GOOGLE = "We are unable to connect to Google right now, please try again later";
const ERR_AUTH_FAIL = "We are unable to authenticate you, please try again!";

const Login = () => {

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  const history = useHistory();
  const redirectToSearch = () => history.replace("/favourites");
  
  const [loginError, setLoginError] = useState("");

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

  const handleGuestLogin = () => {
    trackGuestSignInEvent();
    redirectToSearch();
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
        <IonIcon className="sns-login__next" slot="end" icon={arrowForward} size="large"></IonIcon>
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
      <IonGrid className="login">
        <LoginHeaderRow />
        <LoginOptionsRow
          onGoogleSuccess={handleGoogleLoginSuccess}
          onGoogleFailure={handleGoogleLoginFailure}
          onGuestLogin={handleGuestLogin}
        />
      </IonGrid>
      <CustomToast
        showToast={loginError !== ""}
        setShowToast={() => setLoginError("")}
        toastMessage={loginError}
        dismissBtnHandler={() => trackDismissLoginToastEvent()}
      />
    </IonPage>
  );
};

export default withRouter(Login);
