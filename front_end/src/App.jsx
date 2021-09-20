import { Route } from "react-router-dom";

import { IonApp, IonRouterOutlet, IonTabBar, IonTabs, IonTabButton, IonIcon, IonText } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { mapOutline, starOutline, settingsOutline } from "ionicons/icons";

import Login from "./pages/login/Login";
import SearchHome from "./pages/search/SearchHome";
import SearchResult from "./pages/search/SearchResult";
import Favourites from "./pages/favourites/Favourites";
import Settings from "./pages/settings/Settings";

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
import "mapbox-gl/dist/mapbox-gl.css";

const App = (props) => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/search">
            <SearchHome />
          </Route>

          <Route path="/search-result">
            <SearchResult />
          </Route>

          <Route exact path="/favourites">
            <Favourites />
          </Route>

          <Route exact path="/settings">
            <Settings />
          </Route>

          {/* if logged in redirect */}
          <Route exact path="/">
            <Login />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="search" href="/search">
            <IonIcon icon={mapOutline} />
            <IonText>Map</IonText>
          </IonTabButton>
          <IonTabButton tab="favourites" href="/favourites">
            <IonIcon icon={starOutline} />
            <IonText>Favourites</IonText>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settingsOutline} />
            <IonText>Settings</IonText>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
