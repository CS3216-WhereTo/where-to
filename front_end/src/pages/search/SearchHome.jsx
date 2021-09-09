import { IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonSelect, IonSelectOption } from "@ionic/react";
import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "./SearchHome.css";
import Select from "react-select";
import Fuse from "fuse.js";
import { ellipseOutline, locateSharp, swapVertical } from "ionicons/icons";
import { locationSharp } from "ionicons/icons";

const SearchHome: React.FC = (props) => {
  const options = [
    { label: "Swedish", value: "sv" },
    { label: "English", value: "en" },
  ];

  return (
    <IonPage>
      <div className="search">
        <div className="search-container">
          <div className="start-search">
            <IonIcon slot="start" icon={ellipseOutline} size="large"></IonIcon>
            <Select
              value={options[0]}
              onChange={(e: any) => console.log(e)}
              options={options}
              styles={{
                container: (provided, state) => ({
                  ...provided,
                  display: "flex",
                  flex: 1,
                }),
                control: (provided, state) => ({
                  ...provided,
                  display: "flex",
                  flex: 1,
                }),
              }}
            />
          </div>
          <div className="end-search">
            <IonIcon slot="start" icon={locationSharp} size="large"></IonIcon>
            <Select
              value={options[0]}
              onChange={(e: any) => console.log(e)}
              options={options}
              styles={{
                container: (provided, state) => ({
                  ...provided,
                  display: "flex",
                  flex: 1,
                }),
                control: (provided, state) => ({
                  ...provided,
                  display: "flex",
                  flex: 1,
                }),
              }}
            />
          </div>
        </div>
        
        <div className="swap">
          <IonIcon slot="start" icon={swapVertical} size="large"></IonIcon>
        </div>
      </div>
    </IonPage>
  );
};

export default withRouter(SearchHome);
