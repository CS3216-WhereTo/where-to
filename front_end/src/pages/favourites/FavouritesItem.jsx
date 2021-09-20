import { BrowserRouter as Link } from "react-router-dom";
import { IonLabel, IonItem, IonIcon, IonButton } from "@ionic/react";
import { star, starOutline, mapOutline } from "ionicons/icons";

const FavouritesItem = ({ listItem, onClick }) => {
  const { location, isFav } = listItem;
  return (
    <IonItem>
      <IonLabel>{location}</IonLabel>
      <div className="directions-button">
        {/* Passes Node data to SearchHome */}
        <Link to={{ pathname: "search", state: { destination: { label: "NUS", value: "nus" } } }}>
          <IonButton class="directions-button" slot="end">
            <IonIcon icon={mapOutline}></IonIcon>
          </IonButton>
        </Link>
      </div>
      <IonIcon slot="end" onClick={onClick} icon={isFav ? star : starOutline}></IonIcon>
    </IonItem>
  );
};

export default FavouritesItem;
