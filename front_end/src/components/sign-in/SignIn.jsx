import { IonButton } from "@ionic/react";

import NotSignedIn from '../../assets/not-signed-in.jpg'

import './SignIn.css';

const SignIn = () => {
  return (
    <div className="sign-in">
      <img className="sign-in__img" alt="notsignedin" src={NotSignedIn}/>
      <div className="sign-in__text">
        <p>You are not signed in.</p>
      </div>
      <div className="sign-in__button">
        <IonButton shape="round" href="./">Sign In</IonButton>
      </div>
    </div>
  );
}

export default SignIn;
