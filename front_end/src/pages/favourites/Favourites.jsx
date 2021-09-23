import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { IonPage, IonContent, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

import Loading from '../../components/loading/Loading';
import FavouritesList from "./FavouritesList";
import { trackPageView, trackFavouritesToRecentsTabEvent, trackRecentsToFavouritesTabEvent } from "../../utils/ReactGa";
import UnauthenticatedUserScreen from "../../components/sign-in/SignIn";
import UserStore from "../../stores/UserStore";
import NodeStore from "../../stores/NodeStore";
import "./Favourites.css";
import userTokenExists from "../../utils/AuthChecker";

const Mode = Object.freeze({
  FAVOURITES: "Favourites",
  RECENTS: "Recents"
})

class Location {
  /**
   * @param {number} id 
   * @param {string} name 
   * @param {boolean} isFav 
   */
  constructor(id, name, isFav) {
    this.id = id;
    this.name = name;
    this.isFav = isFav
  }
}

const ERR_INVALID_STATE = 'State should only be either "Favourites" or "Recents"!'

function Favourites(props) {

  /** @type {UserStore} */
  const user = props.user;
  /** @type {NodeStore} */
  const nodes = props.nodes;

  const [ loading, setLoadingStatus ] = useState(true);
  const loggedIn = userTokenExists();
  const mounted = useRef(null);

  //////////////////////////
  // FAVOURITES OBSERVER
  //////////////////////////

  /** @type {[ Location, React.Dispatch<React.SetStateAction<Location>> ]} */
  const [ favourites, setFavourites ] = useState([]);
  function populateFavourites() {
    console.log('FAVOURITES: populateFavourites() called');

    const data = nodes.getFavourites()
      .map(node => new Location(node.node_id, node.name, true));
      if (!mounted.current) return;
      setFavourites(data);

    if (mounted.current) user.fetchRecents(() => populateRecents());
  }
  
  //////////////////////////
  // RECENTS OBSERVER
  //////////////////////////

  const [ recents, setRecents ] = useState([]);
  function populateRecents() {
    console.log('FAVOURITES: populateRecents() called');
    const allNodes = {
      favs: nodes.getFavourites(),
      nonFavs: nodes.getNonFavourites()
    };
    
    function getDestinationFromRoute(obj) {
      /** @type {[number]} */
      const steps = obj.walk.nodes;
      const lastPos = steps.length - 1;
      return steps[lastPos];
    }

    function getNodeDetails(id) {
      const pred = node => node.node_id === id;
      if (allNodes.favs.some(pred)) {
        const idx = allNodes.favs.findIndex(pred);
        const node = allNodes.favs[idx];
        return Location(node.node_id, node.name, true);
      } else {
        const idx = allNodes.nonFavs.findIndex(pred);
        const node = allNodes.nonFavs[idx];
        return Location(node.node_id, node.name, false);
      }
    }

    const data = user.getRecents()
      .map(getDestinationFromRoute)
      .map(getNodeDetails);

    if (!mounted.current) return;
    setRecents(data);
    setLoadingStatus(false);
  }

  useEffect(() => {
    trackPageView(window.location.pathname);
    mounted.current = true;

    if (!loggedIn) {
      setLoadingStatus(false);
      return;
    }

    nodes.fetchNodes(populateFavourites); /* callback fetches recents */

    return () => { mounted.current = false; };
  }, [loggedIn]);

  //////////////////////////
  // SEGMENT CHANGE OBSERVER
  //////////////////////////

  const [segment, setSegment] = useState(Mode.FAVOURITES);
  function handleSegmentChange(event) {
    let value = event.detail.value;
    if (value === segment) return;

    if (value === Mode.FAVOURITES) trackRecentsToFavouritesTabEvent();
    else if (value === Mode.RECENTS) trackFavouritesToRecentsTabEvent();
    else throw new Error(ERR_INVALID_STATE);

    setSegment(value);
  };

  function toggleFavourite(i) {
    if (segment === Mode.FAVOURITES) {
      const nodeId = favourites[i].id;
      nodes.removeFavourite(nodeId);
    } else if (segment === Mode.RECENTS) {
      const node = recents[i];
      if (node.isFav) nodes.removeFavourite(node.id);
      else nodes.addFavourite(node.id);
    } else throw new Error(ERR_INVALID_STATE);
  };

  if (loading) return (<Loading pageName={"Favourites"}/>);
  if (!loggedIn) return (<UnauthenticatedUserScreen pageName={"Favourites"}/>);

  return (
    <IonPage className="page favourites-page">
      <div className="page-header">
        <p className="page-header__text">{segment}</p>
      </div>
      
       {/* -- Segment -- */}
       <IonSegment className="segment" value={segment} onIonChange={handleSegmentChange}>
          <IonSegmentButton className="segment__button" value={Mode.FAVOURITES}>
            <IonLabel className="segment__text">{Mode.FAVOURITES}</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton className="segment__button" value={Mode.FAVOURITES}>
            <IonLabel className="segment__text">{Mode.RECENTS}</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      
      <IonContent>
        {/* -- List -- */}
        <FavouritesList
          className="favourites-list"
          currentList={segment === Mode.FAVOURITES ? favourites : recents}
          isFavouritesTab={segment === "Favourites"}
          toggleFavourite={toggleFavourite}
        />
      </IonContent>
    </IonPage>
  );
};

Favourites.propTypes = {
  user: PropTypes.instanceOf(UserStore).isRequired,
  nodes: PropTypes.instanceOf(NodeStore).isRequired
};

export default Favourites;
