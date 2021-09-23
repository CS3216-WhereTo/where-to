import { IonButton, IonPage, IonContent } from "@ionic/react";

import NotSignedIn from "../../assets/not-signed-in.jpg";

import "./UnauthenticatedScreen.css";

const UnauthenticatedScreen = (props) => {
  const SignIn = () => {
    return (
      <div className="sign-in">
        <img className="sign-in__img" alt="not-signed-in" src={NotSignedIn} />
        <div className="sign-in__text">
          <p>You are not signed in.</p>
        </div>
        <div className="sign-in__button">
          <IonButton shape="round" href="./">
            Sign In
          </IonButton>
        </div>
      </div>
    );
  };

  return (
    <IonPage className="page settings-page">
      <div className="page-header">
        <p className="page-header__text">{props.pageName}</p>
      </div>

      <IonContent>
        <SignIn />
      </IonContent>
    </IonPage>
  );
};

export default UnauthenticatedScreen;
