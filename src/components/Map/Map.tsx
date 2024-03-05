import { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import https from "https";

import * as d3 from "d3";

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
        scale: string|undefined;
        units: string|undefined;
    }
    ) => {
    const { 
        className, center, zoom, mapData, colorMap, dataRange, scale, units 
    } = props;
    const [tileJson, setTileJson] = useState<any>(null);
    const [hist, setHist] = useState<any>(null);
    // const [colormapValues, setColormapValues] = useState<{ [key: number]: string } | null>(null);
    const [colormapValues, setColormapValues] = useState<ColorMapType>([]);
    const [dataRangeMax, setdataRangeMax] = useState<number>(0);

    type ParamsType = {
        url: string | undefined;
        rescale?: string;
        colormap?: { [key: number]: string };
        colormap_name?: string;
        expression?: string;
    };

    type ColorMapType = Array<[[number, number], [number, number, number]]>;

    const createLogScaleColorMap = () => {
        if (!hist) {
            return;
        } else {
            // let colorMap: { [key: number]: string } = {}; // Define a new object
            // setdataRangeMax(0);
            // for (let index = 0; index < hist[1].length; index++) {
            //     let intValue = Math.round(hist[1][index]*100);
            //     colorMap[intValue] = d3.interpolateViridis(index/hist[1].length);
            // };
            // let minKey = Math.min(...Object.keys(colorMap).map(Number));
            // let maxKey = Math.max(...Object.keys(colorMap).map(Number));
            // let normalizedColorMap: { [key: number]: string } = {};
            // for (let key in colorMap) {
            //     let normalizedKey = (Number(key) - minKey) / (maxKey - minKey); // Normalize to 0-1
            //     let rescaledKey = Math.round(normalizedKey * 255); // Rescale to 0-255
            //     normalizedColorMap[rescaledKey] = colorMap[key];
            // }
            // colorMap = normalizedColorMap;
            // console.log(colorMap);
            // setColormapValues(colorMap);
            let colorMap: ColorMapType = [];
            let histMax = Math.max(...hist[1]);
            let histMin = Math.min(...hist[1]);
            const normalizedDataRange = hist[1].map((val: number) => {
                let normVal = (val - histMin) / (histMax - histMin);
                let cmapVal = Math.round(normVal * 255);
                return cmapVal;
            });
            setdataRangeMax(histMax);
            setdataRangeMax(0);
            for (let index = 1; index < normalizedDataRange.length; index++) {
                let thisIndex: number = normalizedDataRange[index];
                if (index === 1) {
                    colorMap.push([[0, thisIndex], [0, 0, 0]]);
                    continue;
                }
                let prevIndex: number = normalizedDataRange[index-1];
                let color = d3.interpolateViridis(index/normalizedDataRange.length);
                let colorArray = d3.color(color)?.rgb();
                if (colorArray) {
                    colorMap.push([[prevIndex, thisIndex], [colorArray.r, colorArray.g, colorArray.b]]);
                }
                if (index === normalizedDataRange.length-1) {
                    colorMap.push([[thisIndex, thisIndex+1], [255, 255, 255]]);
                }
            };
            console.log(colorMap);
            setColormapValues(colorMap);
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
                createLogScaleColorMap();
            });
            let parmas: ParamsType;
            if (scale === 'log10') { // 'log10'
                let histMax = Math.max(...hist[1]);
                let histMin = Math.min(...hist[1]);
                parmas = {
                    url: mapData,
                    rescale: typeof dataRange === 'string' ? dataRange : dataRange.join(","),
                    colormap: JSON.stringify(colormapValues),
                    expression: `(b1 - ${histMin}) / (${histMax} - ${histMin}) * 255`
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