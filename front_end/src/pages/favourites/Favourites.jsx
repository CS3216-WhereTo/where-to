import React, { useState } from 'react';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonSegment, IonSegmentButton, IonLabel,
  IonList, IonItem, IonIcon, IonButton} from "@ionic/react";
import { star, starOutline, mapOutline } from 'ionicons/icons';

import "./Favourites.css";

const Favourites = (props) => {
  // // TODO: some function to fetch favs & recents from server
  const tempFavs = [
    {isFav:true, location:"fav1"}, 
    {isFav:true, location:"fav2"}, 
    {isFav:true, location:"fav3"}, 
    {isFav:true, location:"fav4"}, 
    {isFav:true, location:"fav5"}
  ];
  const tempRecents = [{isFav:false, location:"rec1"}];

  const [view, setView] = useState(tempFavs);

  // a function to handle the segment changes
  const handleSegmentChange = (e) => {
    if (e.detail.value === "favourites") {
      setView(tempFavs);
    } else if (e.detail.value === "recents") {
      setView(tempRecents);
    }
  };

  const toggleStar = () => {
    // TODO: somehow pass index in and change 0 to i
    // also need to trigger some change to the server

    const clonedArray = view.map(a => {return {...a}})
    clonedArray[0].isFav = !view[0].isFav;
    setView(clonedArray);
  }

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
        <IonList>
          {
            view.map((elem, i) => {
                return (
                    <IonItem key={i}> 
                      <IonLabel>{elem.location}</IonLabel>
                      <div className="directions-button">
                        <IonButton class="directions-button" colour="transparent" slot="end" href="/search">
                          <IonIcon icon={mapOutline}></IonIcon>
                        </IonButton>
                      </div>
                        <IonIcon slot="end" onClick={() => toggleStar()} icon={elem.isFav ? star : starOutline}></IonIcon>
                    </IonItem>
                );
            })
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Favourites;
