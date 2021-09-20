import { useEffect } from "react";
import ReactGA from "react-ga4";

// Initialise Google Analytics tracking
export const initialiseGoogleAnalytics = () => {
  ReactGA.initialize("G-FEXK5DK1HP", [{ siteSpeedSampleRate: 100, debug: true }]);
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
    category: "Authentication",
    action: "Signed in using Google",
  });
};

export const trackGoogleSignOutEvent = () => {
  ReactGA.event({
    category: "Authentication",
    action: "Signed out with Google",
  });
};

export const trackGuestSignInEvent = () => {
  ReactGA.event({
    category: "Authentication",
    action: "Continued using Guest account",
  });
};

export const trackSearchStartPointSelectEvent = () => {
  ReactGA.event({
    category: "Search",
    action: "Start point select opened",
  });
};
export const trackSearchEndPointSelectEvent = () => {
  ReactGA.event({
    category: "Search",
    action: "End point select opened",
  });
};
export const trackSearchSwapStartEndEvent = () => {
  ReactGA.event({
    category: "Search",
    action: "Swapped start and end point",
  });
};
export const trackSearchButtonPressEvent = () => {
  ReactGA.event({
    category: "Search",
    action: "Go button for search pressed",
  });
};
export const trackFavouritesToRecentsTabEvent = () => {
  ReactGA.event({
    category: "Favourites",
    action: "Switched from favourites to recents tab",
  });
};

export const trackFavouritesFavouriteEvent = () => {
  ReactGA.event({
    category: "Favourites",
    action: "Favourited a location in Favourites tab",
  });
};

export const trackFavouritesUnfavouriteEvent = () => {
  ReactGA.event({
    category: "Favourites",
    action: "Unfavourited a location in Favourites tab",
  });
};

export const trackFavouritesMapButtonEvent = () => {
  ReactGA.event({
    category: "Favourites",
    action: "Filled destination using a favourite in Favourites tab",
  });
};

export const trackRecentsToFavouritesTabEvent = () => {
  ReactGA.event({
    category: "Recents",
    action: "Switched from recents to favourites tab",
  });
};

export const trackRecentsFavouriteEvent = () => {
  ReactGA.event({
    category: "Recents",
    action: "Favourited a location in Recents tab",
  });
};

export const trackRecentsUnfavouriteEvent = () => {
  ReactGA.event({
    category: "Recents",
    action: "Unfavourited a location in Recents tab",
  });
};

export const trackRecentsMapButtonEvent = () => {
  ReactGA.event({
    category: "Recents",
    action: "Filled destination using a favourite in Recents tab",
  });
};

export const trackUpdateWalkingSpeed = () => {
  ReactGA.event({
    category: "Settings",
    action: "Updated walking speed",
  });
};
