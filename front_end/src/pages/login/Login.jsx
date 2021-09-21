import { IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonIcon } from "@ionic/react";
import { withRouter, useHistory } from "react-router-dom";
import { arrowForward } from "ionicons/icons";
import { GoogleLogin } from "react-google-login"
import "./Login.css";

import Logo from "../../assets/logo.svg";
import { trackPageView, trackGuestSignInEvent } from "../../utils/ReactGa";
import { signUserIn } from "../../utils/AuthChecker";

const Login = () => {
  
  trackPageView(window.location.pathname);
  
  const history = useHistory();
  const redirectToSearchPage = () => history.replace('/search');

  /**
   * @param {import("react-google-login").GoogleLoginResponse} googleResponse 
   */
  function handleGoogleLoginSuccess(googleResponse) {
    const token = googleResponse.tokenId;
    signUserIn(token);
    redirectToSearchPage();
  }

  function handleGoogleLoginFailure(response) {
    console.log(`Login failed with error code ${response.error}: ${response.details}`);
  }

  function handleGuestLogin() {
    trackGuestSignInEvent();
    redirectToSearchPage();
  }

  const loginButton = (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      onSuccess={handleGoogleLoginSuccess}
      onFailure={handleGoogleLoginFailure}
      theme="dark"
      isSignedIn={true}
    />
  );

  const guestLoginButton = (
    <IonButton
      shape="round"
      fill="outline"
      className="sns-login__button"
      onClick={handleGuestLogin}
      routerLink="/search"
    >
      <IonText>Continue as a guest</IonText>
      <IonIcon slot="end" icon={arrowForward} size="large"></IonIcon>
    </IonButton>
  );

  const loginRow = (
    <IonRow className="login__row login__row--bottom">
      <div className="auth">
        <div className="sns-login">
          <IonText className="sns-login__text">
            <h3>Continue with</h3>
          </IonText>

          <div className="login__row">{loginButton}</div>
        </div>

        <div className="auth-divider">
          <div className="auth-divider__div" />
          or
          <div className="auth-divider__div" />
        </div>

        <div className="sns-guest-login">{guestLoginButton}</div>
      </div>
    </IonRow>
  );

  const headerRow = (
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

  return (
    <IonPage className="page login-page">
      <IonGrid className="login">
        {headerRow}
        {loginRow}
      </IonGrid>
    </IonPage>
  );
};

export default withRouter(Login);
