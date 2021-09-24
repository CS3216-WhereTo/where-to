import { IonList } from "@ionic/react";
import PropTypes from "prop-types";

import FavouritesItem from "./FavouritesItem";
import RecentsItem from "./RecentsItem";
/**
 * FavouritesList component
 */
const FavouritesList = (props) => {
  const list = props.currentList;
  const isFavouritesTab = props.isFavouritesTab;
  const toggleFavourite = props.toggleFavourite;

  /**
   * @param {Location} element
   * @param {number} index
   */
  const convertElementToView = (element, index) => {
    if (isFavouritesTab) {
      const item = { id: element.id, name: element.name, isFav: element.isFav };
      return <FavouritesItem key={index} listItem={item} toggleFavourite={(i) => toggleFavourite(index)} />;
    } else {
      return <RecentsItem key={index} listItem={element} />
    }
  };

  if (!list.length) {
    return <p className="favourites-list__text">You do not have any {isFavouritesTab ? "favourites" : "recents"}</p>;
  }
  return <IonList lines="full">{list.map(convertElementToView)}</IonList>;
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
