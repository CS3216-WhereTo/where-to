import { useEffect } from "react";
import ReactGA from "react-ga";

export const initialiseGoogleAnalytics = () => {
  console.log(ReactGA.initialize("G-X0ZRMN67T6"));
};

export const trackPageView = (pathname) => {
  console.log(ReactGA.pageview(pathname));
};

export const trackModalView = (pathname) => {
  ReactGA.modalview(pathname);
};

export const trackGoogleSignInEvent = () => {
  ReactGA.event({
    category: "Authentication",
    action: "Signed in using Google",
  });
};

export const trackGuestSignInEvent = () => {
  ReactGA.event({
    category: "Authentication",
    action: "Continued using Guest account",
  });
};
export const trackGoogleSignOutEvent = () => {
  ReactGA.event({
    category: "Authentication",
    action: "Signed out with Google",
  });
};

export const trackFavouriteEvent = () => {
  ReactGA.event({
    category: "Favourite",
    action: "Favourited a location",
  });
};
export const trackUnfavouriteEvent = () => {
  ReactGA.event({
    category: "Favourite",
    action: "Unfavourited a location",
  });
};
export const trackMapButtonEvent = () => {
  ReactGA.event({
    category: "Map",
    action: "Filled destination using favourite or recent",
  });
};
export const trackUpdateWalkingSpeed = () => {
  ReactGA.event({
    category: "Walking Speed",
    action: "Updated walking speed",
  });
};
