import { useState, useEffect } from "react";

import { IonPage, IonContent, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

import FavouritesList from "./FavouritesList";
import "./Favourites.css";
import { trackPageView, trackFavouritesToRecentsTabEvent, trackRecentsToFavouritesTabEvent } from "../../utils/ReactGa";
import userIsLoggedIn from "../../utils/AuthChecker";
import UnathenticatedUserScreen from "../../components/sign-in/SignIn";

// TODO: pull to refresh
const Favourites = (props) => {
  useEffect(() => {
    // TODO: some function to fetch favs & recents from server
  });

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  const favs = [
    { nodeId: "1", location: "fav1", isFav: true },
    { nodeId: "2", location: "fav2", isFav: true },
    { nodeId: "3", location: "fav3", isFav: true },
    { nodeId: "4", location: "fav4", isFav: true },
    { nodeId: "5", location: "fav5", isFav: true },
  ];

  const recs = [{ nodeId: "6", location: "rec1", isFav: false }];

  const [favourites, setFavourites] = useState(favs);
  const [recents, setRecents] = useState(recs);
  const [segment, setSegment] = useState("Favourites");

  // a function to handle the segment changes
  const handleSegmentChange = (e) => {
    if (e.detail.value === segment) {
      return;
    }

    if (e.detail.value === "Favourites") {
      trackRecentsToFavouritesTabEvent();
    } else {
      trackFavouritesToRecentsTabEvent();
    }

    setSegment(e.detail.value);
  };

  const toggleFavourite = (i) => {
    // TODO: post unfav/fav to server
    const isSegmentFav = segment === "Favourites";
    const currentList = isSegmentFav ? favourites : recents;
    const newList = currentList.slice();
    newList[i].isFav = !currentList[i].isFav;

    isSegmentFav ? setFavourites(newList) : setRecents(newList);
  };

  if (!userIsLoggedIn()) return (<UnathenticatedUserScreen pageName={"Favourites"}/>);

  return (
    <IonPage className="page favourites-page">
      <div className="page-header">
        <p className="page-header__text">{segment}</p>
      </div>
      
       {/* -- Segment -- */}
       <IonSegment className="segment" value={segment} onIonChange={e => handleSegmentChange(e)}>
          <IonSegmentButton className="segment__button" value="Favourites">
            <IonLabel className="segment__text">Favourites</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton className="segment__button" value="Recents">
            <IonLabel className="segment__text">Recents</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      
      <IonContent>
        {/* -- List -- */}
        <FavouritesList
          className="favourites-list"
          currentList={segment === "Favourites" ? favourites : recents}
          isFavouritesTab={segment === "Favourites"}
          toggleFavourite={(i) => toggleFavourite(i)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Favourites;
