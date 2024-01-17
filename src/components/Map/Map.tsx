import { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, use, useEffect, useState } from 'react';
import { mapMarker } from '../../types/map';
import { Icon } from 'leaflet';

import axios, { AxiosResponse } from 'axios';

const DataMap = (props: JSX.IntrinsicAttributes & { className: string; center: number[]; zoom: number; mapData: string|undefined, mapMarkers: mapMarker[] }) => {
    const { className, center, zoom, mapData, mapMarkers } = props;
    const [tileJson, setTileJson] = useState<any>(null);
    const [titilerResponse, setTitilerResponse] = useState<AxiosResponse<any, any>>();

    // const RecenterAutomatically = () => {
    //     const map = ReactLeaflet.useMap();
    //     useEffect(() => {
    //         map.setView(
    //             center as LatLngExpression,
    //             zoom
    //         );
    //     }, [center]);
    //     return null;
    // }

    useEffect(() => {
        const fetchTileJson = async () => {
            const response = await axios.get(
                "https://titiler.xyz/cog/tilejson.json", {
                params: {
                    url: mapData, //"https://acri.blob.core.windows.net/acri/tiletest/NFLH_flags.tif",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://titiler.xyz',
                    },
                }
            }).then((response) => {
                let respData = response.data;
                console.log(respData);
                respData.center = [respData.center[1], respData.center[0]] as LatLngExpression;
                setTileJson(respData);
            });
        }
        if (mapData) {
            fetchTileJson();
        }
    }, [mapData]);

    return (
        <ReactLeaflet.MapContainer className={className} center={[center[0], center[1]]} zoom={zoom} >
            {(tileJson) ? (
                <ReactLeaflet.TileLayer
                    url={tileJson.tiles[0]}
                    tileSize={512}
                    minZoom={tileJson.minzoom}
                    crossOrigin={true}
                    attribution={tileJson.attribution}
                    tms={true}
                />
            ) : (
                <></>
            )}
            {
                (mapMarkers && mapMarkers.length > 0 && (
                    mapMarkers.map((marker: mapMarker) => (
                        <ReactLeaflet.Marker
                            key={marker.det.id}
                            position={[marker.det.centroid[1], marker.det.centroid[0]]}
                            eventHandlers={{
                                click: () => {
                                    marker.preview(marker.det.blob_name);
                                }
                            }}
                            icon={new Icon({
                                iconUrl: 'whalemap/images/loc.png',
                                iconSize: [30, 30]
                            })}
                        > 
                            <ReactLeaflet.Popup>
                                <div>
                                    <u><h2 style={{ justifyContent: "center", alignItems: "center" }}>ID: {marker.det.id}</h2></u>
                                    {marker.det.detection_type}<br />
                                    Confidence: {Number(marker.det.confidence.toFixed(4)) * 100}%
                                    <br />
                                    Coords: {marker.det.centroid[0].toFixed(4)}, {marker.det.centroid[1].toFixed(4)}
                                </div>
                            </ReactLeaflet.Popup>
                        </ReactLeaflet.Marker>
                    )
                )))
            }

            <ReactLeaflet.TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {/* <RecenterAutomatically /> */}
        </ReactLeaflet.MapContainer>
    )
}

export default DataMap;