import { IonList } from "@ionic/react";

import FavouritesItem from './FavouritesItem';

const FavouritesList = ({currentList, onClick}) => {
    return (
        <IonList lines="full">
          {
            currentList.map((elem, i) => {
                return (
                    <FavouritesItem 
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

export default FavouritesList;
