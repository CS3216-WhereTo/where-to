import { IonPage, IonImg, IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonSelect, IonSelectOption } from "@ionic/react";
import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "./SearchHome.css";
import Select from "react-select";
import { ellipseOutline, swapVertical } from "ionicons/icons";
import { locationSharp } from "ionicons/icons";

const SearchHome: React.FC = (props) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const options = [
    { label: "Swedish", value: "sv" },
    { label: "English", value: "en" },
  ];

  return (
    <IonPage className="page search-home-page">
      <div className="search-header">
        <div className="search">
          <div className="search-container">
            <div className="start-search">
              <IonIcon slot="start" icon={ellipseOutline} size="medium"></IonIcon>
              <Select
                value={start}
                onChange={setStart}
                options={options}
                isClearable={true}
                placeholder="Select a starting point"
                styles={{
                  container: (provided, state) => ({
                    ...provided,
                    display: "flex",
                    flex: 1,
                    marginLeft: "8px",
                    marginRight: "8px",
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
              <IonIcon slot="start" icon={locationSharp} size="medium"></IonIcon>
              <Select
                value={end}
                onChange={setEnd}
                options={options}
                isClearable={true}
                placeholder="Select a destination"
                styles={{
                  container: (provided, state) => ({
                    ...provided,
                    display: "flex",
                    flex: 1,
                    marginLeft: "8px",
                    marginRight: "8px",
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
            <IonIcon slot="start" icon={swapVertical} size="medium"></IonIcon>
            <IonButton color="light" size="small">
              Go
            </IonButton>
          </div>
        </div>
        <div className="search-button"></div>
      </div>
    </IonPage>
  );
};

export default withRouter(SearchHome);
