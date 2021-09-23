import { useEffect } from "react";
import ReactGA from "react-ga4";

// Initialise Google Analytics tracking
export const initialiseGoogleAnalytics = () => {
  ReactGA.initialize("G-X0ZRMN67T6", [{ siteSpeedSampleRate: 100, debug: true }]);
};

// Track page view
export const trackPageView = (pathname) => {
  ReactGA.pageview(pathname);
};

// Track model view
export const trackModalView = (pathname) => {
  ReactGA.modalview(pathname);
};

// Track events
export const trackGoogleSignInEvent = () => {
  ReactGA.event({
    category: "auth",
    action: "google_sign_in",
  });
};

export const trackGoogleSignOutEvent = () => {
  ReactGA.event({
    category: "auth",
    action: "google_sign_out",
  });
};

export const trackGuestSignInEvent = () => {
  ReactGA.event({
    category: "auth",
    action: "continue_as_guest",
  });
};

export const trackDismissLoginToastEvent = () => {
  ReactGA.event({
    category: "auth",
    action: "dismiss_toast",
  });
};
export const trackSearchStartPointSelectEvent = () => {
  ReactGA.event({
    category: "search",
    action: "open_start_select",
  });
};

export const trackSearchEndPointSelectEvent = () => {
  ReactGA.event({
    category: "search",
    action: "open_end_select",
  });
};

export const trackSearchSwapStartEndEvent = () => {
  ReactGA.event({
    category: "search",
    action: "swap_start_end",
  });
};

export const trackSearchButtonPressEvent = () => {
  ReactGA.event({
    category: "search",
    action: "press_search_button",
  });
};

export const trackDismissSearchToastEvent = () => {
  ReactGA.event({
    category: "search",
    action: "dismiss_toast",
  });
};

export const trackSetDirectionTypeToBus = () => {
  ReactGA.event({
    category: "search",
    action: "set_direction_type_bus",
  });
};

export const trackSetDirectionTypeToWalk = () => {
  ReactGA.event({
    category: "search",
    action: "set_direction_type_walk",
  });
};

export const trackSearchResultBackPressEvent = () => {
  ReactGA.event({
    category: "search",
    action: "set_direction_type_walk",
  });
};

export const trackFavouritesToRecentsTabEvent = () => {
  ReactGA.event({
    category: "favourites",
    action: "switch_favourites_to_recents_tab",
  });
};

export const trackFavouritesFavouriteEvent = () => {
  ReactGA.event({
    category: "favourites",
    action: "favourite_favourite_item",
  });
};

export const trackFavouritesUnfavouriteEvent = () => {
  ReactGA.event({
    category: "favourites",
    action: "unfavourite_favourite_item",
  });
};

export const trackFavouritesMapButtonEvent = () => {
  ReactGA.event({
    category: "favourites",
    action: "navigate_to_favourite_item",
  });
};

export const trackRecentsToFavouritesTabEvent = () => {
  ReactGA.event({
    category: "recents",
    action: "switch_recents_to_favourites_tab",
  });
};

export const trackRecentsFavouriteEvent = () => {
  ReactGA.event({
    category: "recents",
    action: "favourite_recent_item",
  });
};

export const trackRecentsUnfavouriteEvent = () => {
  ReactGA.event({
    category: "recents",
    action: "unfavourite_recent_item",
  });
};

export const trackRecentsMapButtonEvent = () => {
  ReactGA.event({
    category: "recents",
    action: "navigate_to_recent_item",
  });
};

export const trackUpdateWalkingSpeedEvent = () => {
  ReactGA.event({
    category: "settings",
    action: "update_walking_speed",
  });
};

export const trackDismissSettingsToastEvent = () => {
  ReactGA.event({
    category: "settings",
    action: "dismiss_toast",
  });
};
