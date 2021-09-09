import React from 'react';
import GoogleMapReact from 'google-map-react'
import './MapView.css'
import { withRouter } from 'react-router';

const KEY = 'AIzaSyBbsNRD5na97CAt0F7zzgN_jVeXHzHJbLI';
const NUS_COORDS = { lat: 1.2956, lng: 103.7764 };

export default class MapView extends React.Component {
    render() {
        console.log(this.props);
        return (
            <div className="map map--fixed map--fullscreen">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: KEY }}
                    defaultCenter={ NUS_COORDS }
                    defaultZoom={ 17 }
                    yesIWantToUseGoogleMapApiInternals
                />
            </div>
        );
    }
}

MapView.defaultProps = {
    defaultCenter: NUS_COORDS,
    defaultZoom: 17
}
