import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { IonLabel, IonItem, IonIcon, IonButton } from "@ionic/react";
import { star, starOutline, mapOutline } from "ionicons/icons";

const FavouritesItem = ({ listItem, onClick }) => {
  const { nodeId, location, isFav } = listItem;
  return (
    <IonItem>
      <IonLabel>{location}</IonLabel>
      <div className="directions-button">
        {/* Passes Node data to SearchHome */}
        <Link to={{ pathname: "search", state: { destination: { label: "NUS", value: "nus" } } }}>
            <IonIcon icon={mapOutline}></IonIcon>
        </Link>
      </div>
      <IonIcon slot="end" onClick={onClick} icon={isFav ? star : starOutline}></IonIcon>
    </IonItem>
  );
};

export default FavouritesItem;
