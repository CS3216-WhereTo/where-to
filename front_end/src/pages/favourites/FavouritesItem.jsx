import { Link } from "react-router-dom";
import { IonItem, IonIcon } from "@ionic/react";

import { star, starOutline, mapOutline } from "ionicons/icons";

import "./Favourites.css";

const FavouritesItem = ({ listItem, onClick }) => {
  const { location, isFav } = listItem;
  return (
    <IonItem className="favourites-item">
      <p className="favourites-item__text">{location}</p>
      <div className="favourites-item__buttons">
        {/* Passes Node data to SearchHome */}
        <Link className="favourites-item__link" to={{ pathname: "search", state: { destination: { label: "NUS", value: "nus" } } }}>
            <IonIcon className="favourites-item__icon" icon={mapOutline}></IonIcon>
        </Link>
        <IonIcon className="favourites-item__icon" 
          slot="end" onClick={onClick} 
          icon={isFav ? star : starOutline} />
      </div>
      
    </IonItem>
  );
};

export default FavouritesItem;
