import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { components } from "react-select";
import { starOutline, star } from "ionicons/icons";

import "./Option.css";

const Option = (props) => {
  const [isFavourite, setIsFavourite] = useState(props.data.value.isFavourite);
  // console.log(isFavourite)
  // Function to favourite and unfavourite a location
  const [performAction, setPerformAction] = useState(false);

  useEffect(() => {
    if (!performAction) return;

    props.data.value.nodes.onChange(() => {
      setIsFavourite(!isFavourite);
    });

    if (isFavourite) {
      props.data.value.nodes.removeFavourite(props.data.value.node_id);
    } else {
      props.data.value.nodes.addFavourite(props.data.value.node_id);
    }

    setPerformAction(false)
  }, [isFavourite, performAction, props.data.value.node_id, props.data.value.nodes, props.nodes]);

  const parentClick = (e) => {
    e.stopPropagation();
    setPerformAction(true);
  };

  return (
    <components.Option {...props} className="option">
      <div className="option__text">{props.data.label}</div>
      <IonIcon className="option__icon" slot="start" icon={isFavourite ? star : starOutline} size="medium" onClick={(e) => parentClick(e)} />
    </components.Option>
  );
};

export default Option;
