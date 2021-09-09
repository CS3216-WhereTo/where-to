import { IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon } from "@ionic/react";
import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import "./Login.css";
import { logoApple } from "ionicons/icons";
import { logoFacebook } from "ionicons/icons";
import { logoGoogle } from "ionicons/icons";
import { arrowForward } from "ionicons/icons";

import Logo from "../../assets/logo.png";

const Login: React.FC = (props) => {
  return (
    <IonPage>
      <IonGrid className="login">
        <IonRow className="login__row login__row--top">
          <div className="app-info">
            <IonImg src={Logo} className="app-info__img" />
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

              <IonGrid className="sns-login__grid">
                <IonRow className="sns-login__row">
                  <IonCol className="sns-login__col">
                    <IonButton shape="round" fill="solid" color="dark" className="sns-login__button">
                      <IonIcon slot="icon-only" icon={logoFacebook} size="large"></IonIcon>
                    </IonButton>
                  </IonCol>

                  <IonCol className="sns-login__col">
                    <IonButton shape="round" fill="solid" color="dark" className="sns-login__button">
                      <IonIcon slot="icon-only" icon={logoGoogle} size="large"></IonIcon>
                    </IonButton>
                  </IonCol>

                  <IonCol className="sns-login__col">
                    <IonButton shape="round" fill="solid" color="dark" className="sns-login__button">
                      <IonIcon slot="icon-only" icon={logoApple} size="large"></IonIcon>
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>

            <div className="auth-divider">
              <div className="auth-divider__div" />
              or
              <div className="auth-divider__div" />
            </div>

            <div className="sns-guest-login">
              <IonButton shape="round" fill="outline" className="sns-login__button" href="/search">
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
