import { useState } from "react";
import { IonIcon, IonLabel, IonItem } from "@ionic/react";
import { bus } from "ionicons/icons";

import "./Modal.css";

/**
 * Modal item for Modal to display bus navigation information
 */
const ModalBusItem = ({ location, duration, stops }) => {
  const [showDropDown, setShowDropDown] = useState(false);

  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  return (
    <div>
      <IonItem onClick={toggleDropDown} button="true" detail="false" className="directions" lines={showDropDown ? "none" : "full"}>
        <div className="directions__container">
          <IonIcon className="directions__icon" icon={bus} />
        </div>

        <div className="directions__bus-text">
          <p className="directions__text">{location}</p>
          <div className="directions-dropdown">
            <p className="directions-dropdown__text">{`Ride ${stops} stop${stops > 1 ? "s" : ""}`}</p>
          </div>
        </div>

        <IonLabel className="directions__time" slot="end">
          {parseInt(duration)} min
        </IonLabel>
      </IonItem>
    </div>
  );
};

export default ModalBusItem;
