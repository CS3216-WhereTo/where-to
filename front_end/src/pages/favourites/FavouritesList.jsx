import { IonList } from "@ionic/react";
import PropTypes from "prop-types";

import FavouritesItem from "./FavouritesItem";

function FavouritesList(props) {

  /**
   * @param {Location} element 
   * @param {number} index 
   */
  function convertElementToView(element, index) {
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

  return (
    <IonList lines="full">
      {list.map(convertElementToView)}
    </IonList>
  );
};

const node = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  isFav: PropTypes.bool
});
FavouritesList.propTypes = {
  currentList: PropTypes.arrayOf(node).isRequired,
  isFavouritesTab: PropTypes.bool.isRequired,
  toggleFavourite: PropTypes.func.isRequired
}

export default FavouritesList;
