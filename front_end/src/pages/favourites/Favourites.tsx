import React, { useState } from 'react';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonSegment, IonSegmentButton, IonLabel,
  IonList, IonItem,
  IonTabBar, IonTabButton, IonIcon } from "@ionic/react";
import { star, home, settings } from 'ionicons/icons';

const Favourites: React.FC = () => {
  // TODO: some function to fetch favs & recents from server
  
  const tempFavs = ["fav1", "fav2", "fav3", "fav4", "fav5"];
  const tempRecents = ["rec1"];

  const [view, setView] = useState(tempFavs);

  // a function to handle the segment changes
  const handleSegmentChange = (e: any) => {
    if (e.detail.value === "favourites") {
      setView(tempFavs);
    } else if (e.detail.value === "recents") {
      setView(tempRecents);
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
        <IonList>
          {
            view.map((fav, i) => {
                return (
                    <IonItem key={i}> 
                      <IonLabel>{fav}</IonLabel>
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
