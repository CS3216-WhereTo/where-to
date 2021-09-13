import React from 'react';

import { IonList } from "@ionic/react";

import FavItem from './FavItem';

const FavList = ({view, setView}) => {
    return (
        <IonList>
          {
            view.map((elem, i) => {
                return (
                    <FavItem 
                    key={i}
                    index={i}
                    view={view}
                    setView={setView}
                    />
                );
            })
          }
        </IonList>
    );
}

export default FavList;
