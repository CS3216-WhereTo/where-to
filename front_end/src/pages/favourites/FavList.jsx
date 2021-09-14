import React from 'react';

import { IonList } from "@ionic/react";

import FavItem from './FavItem';

const FavList = ({currentList, onClick}) => {
    return (
        <IonList>
          {
            currentList.map((elem, i) => {
                return (
                    <FavItem 
                    key={i}
                    listItem={elem}
                    onClick={() => onClick(i)}
                    />
                );
            })
          }
        </IonList>
    );
}

export default FavList;
