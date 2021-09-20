import { useState, useEffect } from "react";

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

import FavouritesList from "./FavouritesList";
import "./Favourites.css";
import { trackPageView } from "../../utils/ReactGa";

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
  const [segment, setSegment] = useState("favourites");

  // a function to handle the segment changes
  const handleSegmentChange = (e) => {
    if (e.detail.value === segment) {
      return;
    }
    setSegment(e.detail.value);
  };

  const toggleStar = (i) => {
    // TODO: post unfav/fav to server
    const isSegmentFav = segment === "favourites";
    const currentList = isSegmentFav ? favourites : recents;
    const newList = currentList.slice();
    newList[i].isFav = !currentList[i].isFav;

    isSegmentFav ? setFavourites(newList) : setRecents(newList);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Favourites</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* -- Segment -- */}
      <IonSegment value={segment} onIonChange={(e) => handleSegmentChange(e)}>
        <IonSegmentButton value="favourites">
          <IonLabel>Favourites</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="recents">
          <IonLabel>Recents</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      <IonContent>
        {/* -- List -- */}
        <FavouritesList currentList={segment === "favourites" ? favourites : recents} onClick={(i) => toggleStar(i)} />
      </IonContent>
    </IonPage>
  );
};

export default Favourites;
