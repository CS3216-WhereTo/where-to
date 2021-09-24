import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { IonItem, IonIcon } from "@ionic/react";
import { star, starOutline, mapOutline } from "ionicons/icons";

import {
  trackFavouritesUnfavouriteEvent,
  trackFavouritesFavouriteEvent,
  trackRecentsFavouriteEvent,
  trackRecentsUnfavouriteEvent,
  trackFavouritesMapButtonEvent,
  trackRecentsMapButtonEvent,
} from "../../utils/ReactGa";

import "./Favourites.css";

const FavouritesItem = (props) => {

  const isFavouritesTab = props.isFavouritesTab;
  const toggleFavourite = props.toggleFavourite;
  const { id, name, isFav } = props.listItem;

  const handleToggleFavourite = () => {
    if (isFav) {
      if (isFavouritesTab) trackFavouritesUnfavouriteEvent();
      else trackRecentsUnfavouriteEvent();
    } else {
      if (isFavouritesTab) trackFavouritesFavouriteEvent();
      else trackRecentsFavouriteEvent();
    }

    toggleFavourite();
  };

  const handleRedirectToMap = () => {
    if (isFavouritesTab) trackFavouritesMapButtonEvent();
    else trackRecentsMapButtonEvent();
  };

  return (
    <IonItem className="favourites-item">
      <p className="favourites-item__text">{name}</p>
      <div className="favourites-item__buttons" onClick={handleRedirectToMap}>
        {/* Passes Node data to SearchHome */}
        <Link
          className="favourites-item__link"
          to={{ pathname: "/search", state: { destination: { nodeId: id } } }}
        >
          <IonIcon className="favourites-item__icon" icon={mapOutline} />
        </Link>
        <IonIcon className="favourites-item__icon" 
          slot="end" onClick={handleToggleFavourite} 
          icon={isFav ? star : starOutline} />
      </div>
    </IonItem>
  );
};

const node = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  isFav: PropTypes.bool
});

FavouritesItem.propTypes = {
  listItem: node.isRequired,
  isFavouritesTab: PropTypes.bool.isRequired,
  toggleFavourite: PropTypes.func.isRequired
}

export default FavouritesItem;
