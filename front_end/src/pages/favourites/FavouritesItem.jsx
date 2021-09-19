import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { IonItem, IonIcon, IonButton } from "@ionic/react";
import { star, starOutline, mapOutline } from "ionicons/icons";

import "./Favourites.css";

const FavouritesItem = ({ listItem, onClick }) => {
  const { nodeId, location, isFav } = listItem;
  return (
    <IonItem className="favourites-item">
      <p className="favourites-item__text">{location}</p>
      <div className="favourites-item__directions">
        {/* Passes Node data to SearchHome */}
        <Link to={{ pathname: "search", state: { destination: { label: "NUS", value: "nus" } } }}>
          <IonButton slot="end" class="directions-button" >
            <IonIcon icon={mapOutline} />
          </IonButton>
        </Link>
      </div>
      <IonIcon className="favourites-item__star" 
        slot="end" onClick={onClick} 
        icon={isFav ? star : starOutline} />
    </IonItem>
  );
};

export default FavouritesItem;
