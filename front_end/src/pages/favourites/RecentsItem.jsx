import { Link } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import { IonItem, IonIcon, IonChip, IonLabel } from "@ionic/react";
import { star, starOutline, mapOutline, walk } from "ionicons/icons";
import { bus, chevronDownOutline, chevronUpOutline } from "ionicons/icons";

import "./Favourites.css";
import "./RecentsItem.css";
import { trackRecentsMapButtonEvent, trackSetDirectionTypeToBus, trackSetDirectionTypeToWalk } from "../../utils/ReactGa";

/**
 * Favourite item component
 */
const RecentsItem = (props) => {
  const { start, end, parsedRoute } = props.listItem;
  const [showDropDown, setShowDropDown] = useState(false);
  const [dirType, setDirType] = useState("bus");

  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };
  const handleRedirectToMap = () => {
    trackRecentsMapButtonEvent();
  };

  const displayDropdownList = () => {
    const data = dirType === "bus" ? parsedRoute.bus.directions : parsedRoute.walk.directions;
    return data.map((item) => <p className="dropdown__text">{item.location}</p>);
  };

  return (
    <div>
      <IonItem className="favourites-item">
        <div className="favourites-item__div">
          <p className="favourites-item__text">{`${start.name} ➡️ ${end.name}`}</p>
          <div className="directions-dropdown" onClick={toggleDropDown}>
            <p className="directions-dropdown__text">Directions</p>
            <IonIcon className="directions-dropdown__icon" icon={showDropDown ? chevronUpOutline : chevronDownOutline} />
          </div>
        </div>

        <div className="favourites-item__buttons" onClick={handleRedirectToMap}>
          {/* Passes Node data to SearchHome */}
          <Link
            className="favourites-item__link"
            to={{ pathname: "/search", state: { start: { nodeId: start.node_id }, end: { nodeId: end.node_id } } }}
          >
            <IonIcon className="favourites-item__icon" icon={mapOutline} />
          </Link>
        </div>
      </IonItem>

      <IonItem className={"dropdown " + (showDropDown ? "dropdown--visible" : "dropdown--hidden")}>
        <div className="dropdown-container">
          <div className="dropdown-button__container">
            <IonChip
              className={"search-option " + (dirType === "bus" ? "search-option--selected" : "search-option--unselected")}
              onClick={() => {
                setDirType("bus");
                trackSetDirectionTypeToBus();
              }}
            >
              <IonIcon className={dirType === "bus" ? "search-option__icon--selected" : "search-option__icon--unselected"} icon={bus} />
              <IonLabel>{`${Math.floor(parsedRoute.bus.totalDuration / 60)} min`}</IonLabel>
            </IonChip>

            <IonChip
              className={"search-option " + (dirType === "walk" ? "search-option--selected" : "search-option--unselected")}
              onClick={() => {
                setDirType("walk");
                trackSetDirectionTypeToWalk();
              }}
            >
              <IonIcon className={dirType === "walk" ? "search-option__icon--selected" : "search-option__icon--unselected"} icon={walk} />
              <IonLabel>{`${Math.floor(parsedRoute.walk.totalDuration / 60)} min`}</IonLabel>
            </IonChip>
          </div>
          <div className="dropdown__list">{displayDropdownList()}</div>
        </div>
      </IonItem>
    </div>
  );
};

const node = PropTypes.shape({});

RecentsItem.propTypes = {
  listItem: node.isRequired,
};

export default RecentsItem;
