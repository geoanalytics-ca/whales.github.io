import { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import https from "https";

import { scaleLog } from 'd3-scale';
import { interpolateViridis } from 'd3-scale-chromatic';

const createLogScaleColorMap = (min: number, max: number) => {
    const logScale = scaleLog().domain([min, max]).range([0, 1]);
    return (value: number) => interpolateViridis(logScale(value));
}

const titilerBaseUrl: string = "https://arctus.geoanalytics.ca/titiler";

const DataMap = (
    props: JSX.IntrinsicAttributes & 
    { className: string; 
        center: number[]; 
        zoom: number; 
        mapData: string|undefined;
        colorMap: string|undefined;
        dataRange: number[];
        setDataRange: React.Dispatch<React.SetStateAction<number[]>>;
        // scaling: "log10" | "linear";
    }
    ) => {
    const { className, center, zoom, mapData, colorMap, dataRange, setDataRange } = props;
    const [tileJson, setTileJson] = useState<any>(null);
    const [hist, setHist] = useState<any>(null);

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
                `${titilerBaseUrl}/cog/statistics`, {
                params: {
                    url: mapData,
                    pmin: 2, 
                    pmax: 98, 
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            }).then((response : any) => {
                let respData = response.data;
                console.log(respData);
                let min_pc = Number(respData['b1']['percentile_2']); 
                let max_pc = Number(respData['b1']['percentile_98']);
                setDataRange([min_pc, max_pc]);
            });
            await axios.get(
                    `${titilerBaseUrl}/cog/tilejson.json`, {
                params: {
                    url: mapData,
                    colormap_name: ["viridis"],
                    rescale: dataRange.join(',')
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            }).then((response : any) => {
                let respData = response.data;
                console.log(respData);
                let min_pc = Number(respData['b1']['percentile_2']); 
                let max_pc = Number(respData['b1']['percentile_98']);
                setDataRange([min_pc, max_pc]);
            });
            await axios.get(
                    `${titilerBaseUrl}/cog/tilejson.json`, {
                params: {
                    url: mapData,
                    colormap_name: "viridis",
                    rescale: dataRange.join(',') //typeof dataRange[0] === 'string' ? dataRange.join(',') : dataRange
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            }).then((response : any) => {
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
            <ReactLeaflet.ScaleControl position="topleft" />
        </ReactLeaflet.MapContainer>
    )
}

export default DataMap;