import { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, useEffect, useState } from 'react';
import { mapMarker } from '../../types/map';
import { Icon } from 'leaflet';

import axios from 'axios';

const DataMap = (props: JSX.IntrinsicAttributes & { className: string; center: number[]; zoom: number; mapData: string, mapMarkers: mapMarker[]}) => {
    const { className, center, zoom, mapData, mapMarkers } = props;
    const [tileJson, setTileJson] = useState<any>([]);

    // useEffect(() => {
    //     const fetchTileJson = async () => {
    //         // await fetch(`https://titiler.xyz/cog/tilejson.json?url=${mapData}`).then((response) => {
    //         await fetch("https://titiler.xyz/cog/tilejson.json?url=https://opendata.digitalglobe.com/events/mauritius-oil-spill/post-event/2020-08-12/105001001F1B5B00/105001001F1B5B00.tif").then((response) => {
    //             setTileJson(response.json());
    //         });
    //     };
    //     fetchTileJson();
    // }, [mapData]);
    
    const RecenterAutomatically = () => {
        const map = ReactLeaflet.useMap();
        useEffect(() => {
            map.setView(
                center as LatLngExpression,
                zoom
            );
        }, [center]);
        return null;
    }

    useEffect(() => {
        const fetchTileJson = async () => {
            axios.get(
                "https://titiler.xyz/cog/tilejson.json", {
                params: {
                    url: "https://acri.blob.core.windows.net/acri/tiletest/L3m_20230809__ATLNW_1_AV-MOD_NRRS678_DAY_00.NRRS678_flags_tiled.tif",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://titiler.xyz',
                    },
                }
            }).then((response) => {
                setTileJson(response.data);
            });
        };
        fetchTileJson();
    }, []);

    return (
        <ReactLeaflet.MapContainer className={className} center={[center[0], center[1]]} zoom={zoom} >
            {(tileJson && tileJson.tiles && (
                <ReactLeaflet.TileLayer
                    url={tileJson.tiles[0]}
                    tileSize={128}
                    crossOrigin={true}
                    bounds={tileJson.bounds}
                />
            ))
            }
            {(tileJson && tileJson.tiles && (
                <ReactLeaflet.Rectangle
                    bounds={tileJson.bounds}
                />)
            )}
            {/* <ReactLeaflet.TileLayer
                // url='./Suitable_habitat_proj_2020-10-07/{z}/{x}/{y}.png'
                url=
                bounds={[[45.000001068115196, -70.89516308639624],
                    [51.5100010681152, -51.499833556670154]]}
                zIndex={100}
                tms={true}

            /> */}
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
            <RecenterAutomatically />
        </ReactLeaflet.MapContainer>
    )
}

export default DataMap;