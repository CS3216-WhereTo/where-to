import { Link } from "react-router-dom";

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

const FavouritesItem = ({ listItem, isFavouritesTab, toggleFavourite }) => {
  const { location, isFav } = listItem;

  const handleToggleFavourite = () => {
    if (isFav) {
      if (isFavouritesTab) {
        trackFavouritesUnfavouriteEvent();
      } else {
        trackRecentsUnfavouriteEvent();
      }
    } else {
      if (isFavouritesTab) {
        trackFavouritesFavouriteEvent();
      } else {
        trackRecentsFavouriteEvent();
      }
    }

    toggleFavourite();
  };

  const handleRedirectToMap = () => {
    if (isFavouritesTab) {
      trackFavouritesMapButtonEvent();
    } else {
      trackRecentsMapButtonEvent();
    }
  };
  return (
    <IonItem className="favourites-item">
      <p className="favourites-item__text">{location}</p>
      <div className="favourites-item__buttons" onClick={handleRedirectToMap}>
        {/* Passes Node data to SearchHome */}
        <Link className="favourites-item__link" to={{ pathname: "search", state: { destination: { label: "NUS", value: "nus" } } }}>
          <IonIcon className="favourites-item__icon" icon={mapOutline} />
        </Link>
        <IonIcon className="favourites-item__icon" 
          slot="end" onClick={handleToggleFavourite} 
          icon={isFav ? star : starOutline} />
      </div>
    </IonItem>
  );
};

export default FavouritesItem;
