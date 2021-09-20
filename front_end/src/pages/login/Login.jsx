import { IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon } from "@ionic/react";
import { withRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Login.css";
import { logoGoogle } from "ionicons/icons";
import { arrowForward } from "ionicons/icons";

import Logo from "../../assets/logo.png";
import SplashAnimation from "../../assets/splash-animation.gif";

const google = window.google;
console.log(window.google);
const Login = (props) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
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
              <div className="auth-divider__div" />
              or
              <div className="auth-divider__div" />
            </div>

            <div className="sns-guest-login">
              <IonButton shape="round" fill="outline" className="sns-login__button" routerLink="/search">
                <IonText>Continue as a guest</IonText>
                <IonIcon slot="end" icon={arrowForward} size="large"></IonIcon>
              </IonButton>
            </div>
          </div>
        </IonRow>
      </IonGrid>
    </IonPage>
  );
};

export default withRouter(Login);
