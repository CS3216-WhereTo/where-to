import React from 'react';

import { IonLabel, IonItem, IonIcon, IonButton} from "@ionic/react";
import { star, starOutline, mapOutline } from 'ionicons/icons';

const FavItem = ({listItem, onClick}) => {
    const { nodeId, location, isFav } = listItem;
    return (
        <IonItem> 
            <IonLabel>{location}</IonLabel>
            <div className="directions-button">
            <IonButton class="directions-button" slot="end" href="/search">
                <IonIcon icon={mapOutline}></IonIcon>
            </IonButton>
            </div>
            <IonIcon slot="end" onClick={onClick} icon={isFav ? star : starOutline}></IonIcon>
        </IonItem>
    );
}

export default FavItem;
