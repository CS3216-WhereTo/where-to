import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { components } from "react-select";
import { starOutline, star } from "ionicons/icons";

import './Option.css'

const Option = (props) => {
  const [isFavourite, setIsFavourite] = useState(props.data.value.isFavourite);

  // On data retrieval, set isFavourite accordingly
  useEffect(() => {}, []);

  // Function to favourite and unfavourite a location
  const parentClick = (e) => {
    e.stopPropagation();

    setIsFavourite(!isFavourite);

    // API call to favourite/unfavourite
  };

  return (
    <components.Option {...props} className="option">
      <div className="option__text">{props.data.label}</div>
      <IonIcon className="option__icon" slot="start" icon={isFavourite ? star : starOutline} size="medium" onClick={parentClick} />
    </components.Option>
  );
};

export default Option;
