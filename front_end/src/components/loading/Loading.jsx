import { IonPage, IonSpinner } from "@ionic/react";

import "./Loading.css";

/**
 * Loading screen component
 */
const Loading = ({ pageName }) => {
  const loadingText = (pageName) => {
    if (pageName === "Search") return "Calculating best routes for you";
    else return "Retrieving your personal information";
  };

  return (
    <IonPage className="page loading-page">
      <div className="page-header">
        <p className="page-header__text">{pageName}</p>
      </div>

      <div className="loading-content">
        <p className="loading-content__text">{loadingText(pageName)}</p>
        <IonSpinner className="loading-content__spinner" name="bubbles" />
      </div>
    </IonPage>
  );
};

export default Loading;
