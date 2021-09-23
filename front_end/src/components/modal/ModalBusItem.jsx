import { useState } from "react";

import { IonIcon, IonLabel, IonItem } from "@ionic/react";
import { bus, chevronDownOutline, chevronUpOutline } from "ionicons/icons";

import "./Modal.css";

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
          <p className="directions__text">Take bus to {location}</p>
          <div className="directions-dropdown">
            <p className="directions-dropdown__text">{`Ride ${stops} stop${stops > 1 ? "s" : ""}`}</p>
            {/* <IonIcon className="directions-dropdown__icon" icon={showDropDown ? chevronUpOutline : chevronDownOutline} /> */}
          </div>
        </div>
        <IonLabel className="directions__time" slot="end">
          {parseInt(duration)} min
        </IonLabel>
      </IonItem>
      {/* <IonItem className={"dropdown " + (showDropDown ? "dropdown--visible" : "dropdown--hidden")}>
        <div className="dropdown__list">
          <p className="dropdown__text">Test</p>
          <p className="dropdown__text">Test</p>
          <p className="dropdown__text">Test</p>
          <p className="dropdown__text">Test</p>
        </div>
      </IonItem> */}
    </div>
  );
};

export default ModalBusItem;
