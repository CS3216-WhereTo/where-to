import { IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonIcon } from "@ionic/react";
import { withRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import { arrowForward } from "ionicons/icons";
import "./Login.css";

import Logo from "../../assets/logo.svg";
import SplashAnimation from "../../assets/splash-animation.gif";
import { trackPageView, trackGuestSignInEvent } from "../../utils/ReactGa";

const Login = (props) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    trackPageView(window.location.pathname);

    function handleCredentialResponse(response) {
      localStorage.setItem("jwtIdToken", response.credential);
    }

    window.onload = function () {
      window.google.accounts.id.initialize({
        client_id: "28436641618-2lj6kueceg3fh12or970itop8mhfc636.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "filled_blue", size: "large", shape: "pill" } // customization attributes
      );
      window.google.accounts.id.prompt(); // also display the One Tap dialog
    };

    setTimeout(() => {
      setShowSplash(false);
    }, 1500);
  }, []);

  return (
    <IonPage className="page login-page">
      <div className={"splash " + (!showSplash ? "splash--hide" : "")}>
        <img src={SplashAnimation} alt="splash-animation" className="splash__img" />
      </div>

      <IonGrid className="login">
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
        <IonRow className="login__row login__row--bottom">
          <div className="auth">
            <div className="sns-login">
              <IonText className="sns-login__text">
                <h3>Continue with</h3>
              </IonText>

              <div id="buttonDiv"></div>
            </div>

            <div className="auth-divider">
              <div className="auth-divider__line" />
              or
              <div className="auth-divider__line" />
            </div>

            <div className="sns-guest-login">
              <IonButton className="sns-login__button" shape="round" fill="outline" onClick={trackGuestSignInEvent} routerLink="/search">
                <IonText className="sns-login__text">Continue as a guest</IonText>
                <IonIcon className="sns-login__next" slot="end" icon={arrowForward} size="large"></IonIcon>
              </IonButton>
            </div>
          </div>
        </IonRow>
      </IonGrid>
    </IonPage>
  );
};

export default withRouter(Login);
