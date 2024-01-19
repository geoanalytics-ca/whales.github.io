import { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, use, useEffect, useState } from 'react';
// import { mapMarker } from '../../types/map';
import { Icon } from 'leaflet';

import axios, { AxiosResponse } from 'axios';

const DataMap = (props: JSX.IntrinsicAttributes & { className: string; center: number[]; zoom: number; mapData: string|undefined }) => {
    const { className, center, zoom, mapData } = props;
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
                    colormap_name: "viridis",
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
                    tileSize={256}
                    crossOrigin={true}
                />
            ) : (
                <></>
            )}

            <ReactLeaflet.TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {/* <RecenterAutomatically /> */}
        </ReactLeaflet.MapContainer>
    )
}

export default DataMap;