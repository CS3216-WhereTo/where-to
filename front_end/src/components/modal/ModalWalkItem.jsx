import React from "react";

import { IonIcon, IonLabel, IonItem } from "@ionic/react";
import { walk } from "ionicons/icons";


import "./ModalItem.css";

const ModalWalkItem = ({ location, duration }) => {
  return (
    <IonItem className="directions">
      <IonIcon className="directions__icon" icon={walk}></IonIcon>
      <p className="directions__text">Walk to {location}</p>
      <IonLabel className="directions__time" slot="end">
        {parseInt(duration)} min
      </IonLabel>
    </IonItem>

  );
};
  
export default ModalWalkItem;

