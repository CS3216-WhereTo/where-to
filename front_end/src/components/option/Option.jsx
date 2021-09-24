import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { components } from "react-select";
import { starOutline, star } from "ionicons/icons";

import "./Option.css";

/**
 *  Option component for react-select
 */
const Option = (props) => {
  const [isFavourite, setIsFavourite] = useState(props.data.value.isFavourite);

  const [performAction, setPerformAction] = useState(false);

  useEffect(() => {
    if (!performAction) return;

    const value = props.data.value;

    const toggleFavourite = () => {
      setIsFavourite(!isFavourite);
      props.data.value.favouriteCallback();
    };

    if (isFavourite) {
      value.nodes.removeFavourite(value.node_id, toggleFavourite);
    } else {
      value.nodes.addFavourite(value.node_id, toggleFavourite);
    }

    setPerformAction(false);
  }, [isFavourite, performAction, props.data.value, props.data.value.node_id, props.data.value.nodes, props.nodes]);

  const parentClick = (e) => {
    e.stopPropagation();
    setPerformAction(true);
  };

  return (
    <components.Option {...props} className="option">
      <div className="option__text">{props.data.label}</div>
      {props.data.value.isLoggedIn && (
        <IonIcon className="option__icon" slot="start" icon={isFavourite ? star : starOutline} size="medium" onClick={(e) => parentClick(e)} />
      )}
    </components.Option>
  );
};

export default Option;
