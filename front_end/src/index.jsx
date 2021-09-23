import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

import NodeGateway from './gateways/NodeGateway';
import FavouritesGateway from './gateways/FavouritesGateway';
import RouteGateway from './gateways/RouteGateway';
import UserGateway from './gateways/UserGateway';
import NodeStore from './stores/NodeStore';
import RouteStore from './stores/RouteStore';
import UserStore from './stores/UserStore';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const nodeGateway = new NodeGateway();
const favGateway = new FavouritesGateway();
const routeGateway = new RouteGateway();
const userGateway = new UserGateway();
const nodeStore = new NodeStore(nodeGateway, favGateway);
const routeStore = new RouteStore(routeGateway);
const userStore = new UserStore(userGateway);

ReactDOM.render(
  <React.StrictMode>
    <App nodes={nodeStore} routes={routeStore} users={userStore} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
