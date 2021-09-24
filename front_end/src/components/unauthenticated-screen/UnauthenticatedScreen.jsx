import { IonButton, IonPage, IonContent } from "@ionic/react";

import "./UnauthenticatedScreen.css";
import { ReactComponent as NotSignedInSvg } from "../../assets/not-signed-in.svg";

/**
 * Unauthenticated screen component when user is not signed in
 */
const UnauthenticatedScreen = (props) => {
  const SignIn = () => {
    return (
      <div className="sign-in">
        <NotSignedInSvg className="sign-in__img" />
        <div className="sign-in__text">
          <p>You are not signed in.</p>
        </div>
        <IonButton shape="round" href="./" className="sign-in__button">
          Sign In
        </IonButton>
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
