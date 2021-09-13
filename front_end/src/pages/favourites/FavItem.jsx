import React from 'react';

import { IonLabel, IonItem, IonIcon, IonButton} from "@ionic/react";
import { star, starOutline, mapOutline } from 'ionicons/icons';

const FavItem = ({index, view, setView}) => {
    const { nodeId, location, isFav } = view[index];

    const toggleStar = (index, view, setView) => {
        // TODO: unfav location using nodeId

        const clonedArray = view.map(a => {return {...a}})
        clonedArray[index].isFav = !view[index].isFav;
        setView(clonedArray);
    }

    return (
        <IonItem key={index}> 
            <IonLabel>{location}</IonLabel>
            <div className="directions-button">
            <IonButton class="directions-button" slot="end" href="/search">
                <IonIcon icon={mapOutline}></IonIcon>
            </IonButton>
            </div>
            <IonIcon slot="end" onClick={() => toggleStar(index, view, setView)} icon={isFav ? star : starOutline}></IonIcon>
        </IonItem>
    );
}

export default FavItem;
