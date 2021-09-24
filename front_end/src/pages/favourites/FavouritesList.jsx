import { IonList } from "@ionic/react";
import PropTypes from "prop-types";

import FavouritesItem from "./FavouritesItem";

/**
 * FavouritesList component
 */
 const FavouritesList = (props) => {
  /**
   * @param {Location} element
   * @param {number} index
   */
   const convertElementToView = (element, index) => {
    const item = { id: element.id, name: element.name, isFav: element.isFav }
    return (
      <FavouritesItem
        key={index} listItem={item}
        isFavouritesTab={isFavouritesTab}
        toggleFavourite={(i) => toggleFavourite(index)}
      />
    );
  }

  const list = props.currentList;
  const isFavouritesTab = props.isFavouritesTab;
  const toggleFavourite = props.toggleFavourite;

  if (!list.length) {
    return (
      <p className="favourites-list__text">You do not have any {isFavouritesTab ? "favourites" : "recents"}</p>
    );
  }
  return (
    <IonList lines="full">
      {list.map(convertElementToView)}
    </IonList>
  );
};

const node = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  isFav: PropTypes.bool,
});
FavouritesList.propTypes = {
  currentList: PropTypes.arrayOf(node).isRequired,
  isFavouritesTab: PropTypes.bool.isRequired,
  toggleFavourite: PropTypes.func.isRequired,
};

export default FavouritesList;
