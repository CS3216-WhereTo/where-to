import { useState, useEffect } from 'react';

import { IonPage, IonContent, 
  IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

import FavouritesList from './FavouritesList';
import "./Favourites.css";

const Favourites = (props) => {
  useEffect(() => {
    // TODO: some function to fetch favs & recents from server
  })

  const favs = [
    {nodeId:"1", location:"fav1", isFav:true}, 
    {nodeId:"2", location:"fav2", isFav:true}, 
    {nodeId:"3", location:"fav3", isFav:true}, 
    {nodeId:"4", location:"fav4", isFav:true}, 
    {nodeId:"5", location:"fav5", isFav:true},
  ];

  const recs = [
    {nodeId:"6", location:"rec1", isFav:false}
  ];

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
  }

  return (
    <IonPage className="page favourites-page">
      <p className="page-header">Favourites</p>
      
       {/* -- Segment -- */}
       <IonSegment className="segment" value={segment} onIonChange={e => handleSegmentChange(e)}>
          <IonSegmentButton className="segment__button" value="favourites">
            <IonLabel className="segment__text">Favourites</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton className="segment__button" value="recents">
            <IonLabel className="segment__text">Recents</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      
      <IonContent>
        {/* -- List -- */}
        <FavouritesList 
          className="favourites-list"
          currentList={segment === "favourites" ? favourites : recents} 
          onClick={(i) => toggleStar(i)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Favourites;
