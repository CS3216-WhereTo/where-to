import { IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonSelect, IonSelectOption } from "@ionic/react";
import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "./SearchHome.css";
import Select from 'react-select';import Fuse from "fuse.js";

import Logo from "../../assets/logo.png";
interface SelectSearchOption {
  name: string;
  value: string;
}

const SearchHome: React.FC = (props) => {
  const options: {label: string, value: string}[] = [
    { label: "Swedish", value: "sv" },
    { label: "English", value: "en" },
  ];

  

  return (
    <IonPage>
       <Select
        value={{ label: "Swedish", value: "sv" }}
        onChange={(e: any)=>console.log(e)}
        options={options}
      />
    </IonPage>
  );
};

export default withRouter(SearchHome);
