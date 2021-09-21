import { IonList } from "@ionic/react";

import FavouritesItem from "./FavouritesItem";

const FavouritesList = ({ currentList, isFavouritesTab, toggleFavourite }) => {
  return (
    <IonList lines="full">
      {currentList.map((elem, i) => {
        return <FavouritesItem key={i} listItem={elem} isFavouritesTab={isFavouritesTab} toggleFavourite={() => toggleFavourite(i)} />;
      })}
    </IonList>
  );
};

export default FavouritesList;
