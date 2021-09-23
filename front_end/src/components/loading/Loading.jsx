import { IonPage, IonSpinner } from '@ionic/react';
import './Loading.css';

const Loading = ({ pageName }) => {
  return (
    <IonPage className="page loading-page">
      <div className="page-header">
        <p className="page-header__text">{pageName}</p>
      </div>
      <div className="loading-content">
        <p className="loading-content__text">Calculating best routes for you</p>
        <IonSpinner className="loading-content__spinner" name="bubbles" />
      </div>
    </IonPage>
  );
};

export default Loading;
