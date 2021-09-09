import { Redirect, Route } from "react-router-dom";

import { IonApp, IonRouterOutlet, IonTabBar, IonTabs, IonTabButton, IonIcon } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { mapOutline, starOutline, settingsOutline } from "ionicons/icons";

import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import SearchHome from "./pages/search/SearchHome";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App = (props) => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>

          <Route exact path="/search">
            <SearchHome />
          </Route>

          {/* if logged in redirect */}
          <Route exact path="/">
            <Login />
          </Route>
        </IonRouterOutlet>
  
        <IonTabBar slot="bottom">
          <IonTabButton tab="search" href="/search">
            <IonIcon icon={mapOutline} />
          </IonTabButton>
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={starOutline} />
          </IonTabButton>
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={settingsOutline} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
