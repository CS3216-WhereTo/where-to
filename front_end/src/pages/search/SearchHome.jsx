import { IonPage, IonIcon, IonRippleEffect } from "@ionic/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { ellipseOutline, swapVertical, locationSharp } from "ionicons/icons";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useLocation, useHistory } from "react-router-dom";
import { geolocated } from "react-geolocated";

import "./SearchHome.css";
import Loading from "../../components/loading/Loading";
import CustomToast from "../../components/custom-toast/CustomToast";
import CustomSelect from "../../components/custom-select/CustomSelect";
import { trackPageView, trackDismissSearchToastEvent } from "../../utils/ReactGa";
import userTokenExists from "../../utils/AuthChecker";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

/**
 * Component for search
 */
const SearchHome = (props) => {
  let redirectProps = useLocation();
  let history = useHistory();

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(103.7764);
  const [lat, setLat] = useState(1.2956);
  const [zoom, setZoom] = useState(17);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [options, setOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  /* A copy of options to support search in CustomSelect */
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [routeObject, setRouteObject] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);

  /**
   * Check if there is a state passed from Favourites
   * If so, set it as the end point
   */
  useEffect(() => {
    if (redirectProps?.state?.end) {
      const endFromFavourite = options.find((e) => Number(e.value.node_id) === Number(redirectProps?.state?.end.nodeId));
      setEnd(endFromFavourite);

      if (redirectProps?.state?.end) {
        const startFromRecent = options.find((e) => Number(e.value.node_id) === Number(redirectProps?.state?.start.nodeId));
        setStart(startFromRecent);
      }
    }
  }, [options, redirectProps]);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  /* Callback for fetching nodes from NodesStore*/
  const fetchNodes = useCallback(() => {
    const isLoggedIn = userTokenExists();

    const fetchNodesCallback = () => {
      const favourites = props.nodes.getFavourites().map((node) => {
        return {
          label: node.name,
          value: {
            ...node,
            isFavourite: true,
            nodes: props.nodes,
            favouriteCallback: fetchNodes,
            isLoggedIn: isLoggedIn,
          },
        };
      });

      const nonFavourites = props.nodes.getNonFavourites().map((node) => {
        return {
          label: node.name,
          value: {
            ...node,
            isFavourite: false,
            nodes: props.nodes,
            favouriteCallback: fetchNodes,
            isLoggedIn: isLoggedIn,
          },
        };
      });

      /* Show favourites above non-favourites in CustomSelect */
      setOptions([...favourites, ...nonFavourites]);
      setFilteredOptions([...favourites, ...nonFavourites]);
      setOptionsLoading(false);
    };

    props.nodes.fetchNodes(fetchNodesCallback);
  }, [props.nodes]);

  useEffect(() => {
    setOptionsLoading(true);
    fetchNodes();
  }, [fetchNodes]);

  /* Initialise Map */
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [lng, lat],
      maxBounds: [
        [103.59364428182482, 1.2118245793229845],
        [104.03997620235008, 1.4679048601977227],
      ],
      zoom: zoom,
    });

    /* Add GeolocateControl for user to drop a marker on their current location */
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        zoom: zoom,
      },
      showAccuracyCircle: false,
      trackUserLocation: true,
      showUserHeading: true,
    });

    map.current.addControl(geolocate);

    /* Add NavigationControl for user to zoom on the map */
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      })
    );

    /* Resize the map to fit screen and center on user's current location */
    map.current.once("load", () => {
      map.current.resize();
      geolocate.trigger();
    });
  });

  /* Handle search for CustomSearch */
  const handleInputChange = (input) => {
    const displayOptions = options.filter((option) => {
      const words = option.label.toLowerCase().split(" ");
      const inputWords = input.toLowerCase().split(" ");

      const reducer = (acc, inputWord) => {
        for (const word of words) {
          if (word.startsWith(inputWord) || word.startsWith("(" + inputWord)) {
            return acc && true;
          }
        }
        return acc && false;
      }

      return inputWords.reduce(reducer, true);
    });

    setFilteredOptions(displayOptions);
  };

  /* Swap the start and end locations */
  const swapStartEnd = () => {
    const temp = start;
    setStart(end);
    setEnd(temp);
  };

  const submitSearch = () => {
    // Either field is empty
    if (!start || !end) {
      setToastMessage(`⚠️ Please indicate ${!start ? "a start" : "an end"} point.`);
      setShowToast(true);
      return;
    }

    if (start.value.node_id === end.value.node_id) {
      setToastMessage(`⚠️ The start and end points cannot be the same.`);
      setShowToast(true);
      return;
    }

    const fetchRoutesCallback = () => {
      const route = props.routes.getRoutes();

      if (route) {
        const start_coordinates = start.value.coordinates;
        const route_start_coordinates = route.walk.path[0].coordinates;

        const end_coordinates = end.value.coordinates;
        const route_end_coordinates = route.walk.path.at(-1).coordinates;

        if (
          !(
            start_coordinates[0] === route_start_coordinates[0] &&
            start_coordinates[1] === route_start_coordinates[1] &&
            end_coordinates[0] === route_end_coordinates[0] &&
            end_coordinates[1] === route_end_coordinates[1]
          )
        ) {
          setToastMessage(`⚠️ There was a problem searching for the directions. Please try again.`);
          setShowToast(true);
          return;
        }
      }

      setRouteObject({
        start: { label: start.label, value: { coordinates: start.value.coordinates, name: start.value.name, nodeId: start.value.node_id } },
        end: { label: end.label, value: { coordinates: end.value.coordinates, name: end.value.name, nodeId: end.value.node_id } },
        ...route,
      });
    };

    setSearchLoading(true);
    props.routes.fetchRoutes(start.value.node_id, end.value.node_id, fetchRoutesCallback);
  };
  /* Pass routeObject to SearchResult */
  useEffect(() => {
    if (routeObject.start === undefined || routeObject.start === null) return;

    history.push({
      pathname: "/search-result",
      state: routeObject,
    });
  }, [history, routeObject]);

  return searchLoading ? (
    <Loading pageName="Search"></Loading>
  ) : (
    <IonPage className="page search-home-page">
      <div className="search-header">
        <div className="search-container">
          <div className="search-inner-container">
            <div className="search-inner-container__content">
              <IonIcon className="search__icon" slot="start" icon={ellipseOutline} size="medium"></IonIcon>
              <CustomSelect
                className="search__input"
                value={start}
                onChange={setStart}
                options={filteredOptions}
                onInputChange={handleInputChange}
                disabled={optionsLoading}
                placeholder="Select a starting point"
              />
            </div>

            <div className="search-inner-container__content">
              <IonIcon className="search-inner-container__icon" slot="start" icon={locationSharp} size="medium"></IonIcon>
              <CustomSelect
                className="search-inner-container__input"
                value={end}
                onChange={setEnd}
                options={options}
                disabled={optionsLoading}
                onInputChange={handleInputChange}
                placeholder="Select a destination"
              />
            </div>
          </div>

          <div className="search-buttons">
            <IonIcon className="search-buttons__icon" slot="icon-only" onClick={swapStartEnd} icon={swapVertical} />
            <p className="search-buttons__go ion-activatable" onClick={() => submitSearch()}>
              <b>GO</b>
              <IonRippleEffect></IonRippleEffect>
            </p>
          </div>
        </div>
      </div>

      <div ref={mapContainer} className="map map--fixed map--fullscreen" />
      <CustomToast showToast={showToast} setShowToast={setShowToast} toastMessage={toastMessage} dismissBtnHandler={trackDismissSearchToastEvent} />
    </IonPage>
  );
};

// Wrapper for Geolocation API, related attributes can be accessed via props
export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(SearchHome);
