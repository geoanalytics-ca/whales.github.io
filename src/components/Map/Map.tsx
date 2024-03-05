import { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import https from "https";

import { scaleSequential } from 'd3-scale';
import { interpolateViridis } from 'd3-scale-chromatic';

// const titilerBaseUrl: string = "https://arctus.geoanalytics.ca/titiler";
const titilerBaseUrl: string = "http://localhost:8000";

const DataMap = (
    props: JSX.IntrinsicAttributes & 
    { className: string; 
        center: number[]; 
        zoom: number; 
        mapData: string|undefined;
        colorMap: string|undefined;
        dataRange: number[];
        setDataRange: React.Dispatch<React.SetStateAction<number[]>>;
        scale: string|undefined;
        units: string|undefined;
    }
    ) => {
    const { 
        className, center, zoom, mapData, colorMap, dataRange, setDataRange, scale, units 
    } = props;
    const [tileJson, setTileJson] = useState<any>(null);
    const [hist, setHist] = useState<any>(null);
    const [colormapValues, setColormapValues] = useState<{[key: number]: string}>();

    type ParamsType = {
        url: string | undefined;
        rescale: string;
        colormap?: {};
        colormap_name?: string;
        expression?: string;
    };

    function clampedArray(arr: number[], min: number, max: number): number[] {
        return arr.map(num => Math.max(min, Math.min(max, num)));
    }

    const createLogScaleColorMap = () => {
        if (!hist) {
            return;
        } else {
            let colorMap: {[key: number]: string} = {};
            hist[1] = clampedArray(hist[1], dataRange[0], dataRange[1]);
            const scale = scaleSequential([0,hist[1].length], interpolateViridis).clamp(true);
            hist[1].forEach((value: number, index: number) => {
                colorMap[value] = scale(index);
            });
            console.log(colorMap);
            return colorMap;
        }
    }

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
        console.log(`units: ${units}`)
        console.log(`scale: ${scale}`);
        console.log(`range: ${dataRange}`);
        // console.log(`colormap: ${colorMap}`);
        console.log(`colormapValues: ${colormapValues?.toString()}`);
        const fetchTileJson = async () => {
            await axios.get(
                `${titilerBaseUrl}/cog/statistics`, {
                params: {
                    url: mapData,
                    pmin: 2, 
                    pmax: 98, 
                    histogram_bins: 100,
                    histogram_range: typeof dataRange === 'string' ? dataRange : dataRange.join(","),
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
                setHist(respData['b1']['histogram']);
                setColormapValues(createLogScaleColorMap());
            });
            let parmas: ParamsType;
            if (scale === 'log10') { // 'log10'
                parmas = {
                    url: mapData,
                    rescale: typeof dataRange === 'string' ? dataRange : dataRange.join(","),
                    colormap: JSON.stringify(colormapValues)
                }
            } else { // 'linear'
                parmas = {
                    url: mapData,
                    rescale: typeof dataRange === 'string' ? dataRange : dataRange.join(","),
                    colormap_name: colorMap
                }
            }

            await axios.get(
                    `${titilerBaseUrl}/cog/tilejson.json`, {
                params: parmas,
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