import { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import https from "https";

const DataMap = (props: JSX.IntrinsicAttributes & { className: string; center: number[]; zoom: number; mapData: string|undefined }) => {
    const { className, center, zoom, mapData } = props;
    const [tileJson, setTileJson] = useState<any>(null);

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
            await axios.get(
                "https://arctus.geoanalytics.ca/titiler/cog/tilejson.json", {
                params: {
                    url: mapData,
                    colormap: {
                        0: "#440154",
                        200: "#482878",
                        400: "#3e4a89",
                        600: "#31688e",
                        800: "#35b779",
                        1000: "#35b779",
                    },
                    rescale: "0,1000"
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
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