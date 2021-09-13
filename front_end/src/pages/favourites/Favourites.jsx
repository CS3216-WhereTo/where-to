import React, { useState, useEffect } from 'react';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

import FavList from './FavList';
import "./Favourites.css";

const Favourites = (props) => {
  const favs = [
    {nodeId:"1", location:"fav1", isFav:true}, 
    {nodeId:"2", location:"fav2", isFav:true}, 
    {nodeId:"3", location:"fav3", isFav:true}, 
    {nodeId:"4", location:"fav4", isFav:true}, 
    {nodeId:"5", location:"fav5", isFav:true}
  ];

  const recents = [
    {nodeId:"6", location:"rec1", isFav:false}
  ];

  const [view, setView] = useState(favs);

  useEffect(() => {
    // TODO: some function to fetch favs & recents from server
  })


  // a function to handle the segment changes
  const handleSegmentChange = (e) => {
    if (e.detail.value === "favourites") {
      setView(favs);
    } else if (e.detail.value === "recents") {
      setView(recents);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Favourites</IonTitle>
        </IonToolbar>
      </IonHeader>
      
       {/* -- Segment -- */}
       <IonSegment onIonChange={e => handleSegmentChange(e)}>
          <IonSegmentButton value="favourites">
            <IonLabel>Favourites</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="recents">
            <IonLabel>Recents</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      
      <IonContent>
        {/* -- List -- */}
        <FavList view={view} setView={setView}></FavList>
      </IonContent>
    </IonPage>
  );
};

export default Favourites;
