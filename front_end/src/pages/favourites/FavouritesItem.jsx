import { Link } from "react-router-dom";
import { IonLabel, IonItem, IonIcon, IonButton } from "@ionic/react";
import { star, starOutline, mapOutline } from "ionicons/icons";
import {
  trackFavouritesUnfavouriteEvent,
  trackFavouritesFavouriteEvent,
  trackRecentsFavouriteEvent,
  trackRecentsUnfavouriteEvent,
  trackFavouritesMapButtonEvent,
  trackRecentsMapButtonEvent,
} from "../../utils/ReactGa";

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
    <IonItem>
      <IonLabel>{location}</IonLabel>
      <div className="directions-button" onClick={handleRedirectToMap}>
        {/* Passes Node data to SearchHome */}
        <Link to={{ pathname: "search", state: { destination: { label: "NUS", value: "nus" } } }}>
          <IonButton class="directions-button" slot="end">
            <IonIcon icon={mapOutline} />
          </IonButton>
        </Link>
      </div>
      <IonIcon slot="end" onClick={handleToggleFavourite} icon={isFav ? star : starOutline}></IonIcon>
    </IonItem>
  );
};

export default FavouritesItem;
