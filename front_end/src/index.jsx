import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import NodeGateway from './gateways/NodeGateway';
import FavouritesGateway from './gateways/FavouritesGateway';
import RouteGateway from './gateways/RouteGateway';
import NodeStore from './stores/NodeStore';
import RouteStore from './stores/RouteStore';

const axios = require('axios').default;
axios.defaults.baseURL = '{insert URL here}/api/v1';

const nodeGateway = new NodeGateway();
const favGateway = new FavouritesGateway();
const routeGateway = new RouteGateway();
const nodeStore = new NodeStore(nodeGateway, favGateway);
const routeStore = new RouteStore(routeGateway);

ReactDOM.render(
  <React.StrictMode>
    <App nodes={nodeStore} routes={routeStore}/>
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
