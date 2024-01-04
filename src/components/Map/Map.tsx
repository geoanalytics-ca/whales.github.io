import Leaflet, { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, useState, useEffect } from 'react';

const DynamicMap = ({ className, mapCenter, defaultZoom, ...rest }: { className: string, mapCenter: number[], defaultZoom: number, [key: string]: any }) => {

    const latlngCenter: LatLngExpression = [mapCenter[0], mapCenter[1]];

    useEffect(() => {
        (async function init() {
            Leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
                iconUrl: 'leaflet/images/marker-icon.png',
                shadowUrl: 'leaflet/images/marker-shadow.png',
            });
        })();
    }, []);

    return (
        <ReactLeaflet.MapContainer className={className} center={latlngCenter} zoom={defaultZoom} {...rest}>
            <ReactLeaflet.TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                // attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
            />
            {/* <ReactLeaflet.TileLayer
                url="https://titiler.xyz"
            /> */}
            {/* {typeof children === 'function' && children(ReactLeaflet || {}, Leaflet || {})} */}
        </ReactLeaflet.MapContainer>
    )
}

const DataMap = (props: JSX.IntrinsicAttributes & { className: string; center: number[]; zoom: number; }) => {
    const { center, zoom } = props;
    return (
        <div>
            <DynamicMap {...props} mapCenter={center} defaultZoom={zoom} />
        </div>
    )
}

export default DataMap;