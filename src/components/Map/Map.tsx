import { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import https from "https";
import * as d3 from "d3";

import Legend from './Legend';

const titilerBaseUrl: string = "https://arctus.geoanalytics.ca/titiler";

const DataMap = (
    props: JSX.IntrinsicAttributes & 
    { className: string; 
        center: number[]; 
        zoom: number; 
        mapData: string|undefined;
        colorMapName: string|undefined;
        dataRange: number[];
        scale: string|undefined;
        units: string|undefined;
    }
    ) => {
    const { 
        className, center, zoom, mapData, colorMapName, dataRange, scale, units 
    } = props;
    const [tileJson, setTileJson] = useState<any>(null);
    const [hist, setHist] = useState<any>(null);
    // const [colormapValues, setColormapValues] = useState<{ [key: number]: string } | null>(null);
    const [colormapValues, setColormapValues] = useState<ColorMapType>([]);

    let dataRangeMin;
    let dataRangeMax;

    if (dataRange){
        if (typeof dataRange === 'string') {
            let range = (dataRange as string).split(",");
            dataRangeMin = parseFloat(range[0]);
            dataRangeMax = parseFloat(range[1]);
        } else {
            dataRangeMin = dataRange[0];
            dataRangeMax = dataRange[1];
        }
    }

    type ParamsType = {
        url: string | undefined;
        rescale?: string;
        colormap?: { [key: number]: string };
        colormap_name?: string;
        expression?: string;
    };

    type ColorMapType = Array<[[number, number], [number, number, number]]>;

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

    const fetchStatistics = async () => {
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
        });
    };

    useEffect(() => {
        if (mapData && dataRange) {
            fetchStatistics();
        }
    }, [mapData, dataRange]);

    const createScaleColorMap = async () => {
        if (!hist) {
            return;
        } else {
            let colorMap: ColorMapType = [];
            let histMax = hist[1][hist[1].length-1];
            let histMin = hist[1][0];
            const normalizedDataRange = hist[1].map((val: number) => {
                let normVal = (val - histMin) / (histMax - histMin);
                let cmapVal = Math.round(normVal * 255);
                return cmapVal;
            });
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
    };

    useEffect(() => {
        if (hist) {
            createScaleColorMap();
        }
    }, [hist]);

    const fetchTileJson = async () => {
        let parmas: ParamsType;
        parmas = {
            url: mapData,
            rescale: typeof dataRange === 'string' ? dataRange : dataRange.join(","),
            colormap: JSON.stringify(colormapValues),
        }                
        if (scale === 'log10') { // 'log10'
            if (hist) {
                let histMax = hist[1][hist[1].length-1];
                let histMin = hist[1][0];
                parmas.expression = `(b1 - ${histMin}) / (${histMax} - ${histMin}) * 255`
            }
        }

        await axios.get(
                `${titilerBaseUrl}/cog/tilejson.json`, {
            params: parmas,
            headers: {
                'Content-Type': 'application/json'
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: true
            })
        }).then((response : any) => {
            let respData = response.data;
            console.log(respData);
            respData.center = [respData.center[1], respData.center[0]] as LatLngExpression;
            setTileJson(respData);
        });
    };

    useEffect(() => {
        if (mapData && dataRange && colormapValues.length != 0) {
            fetchTileJson();
        }
    }, [mapData, dataRange, colormapValues]);

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
            {hist && colormapValues.length != 0 && dataRangeMin && dataRangeMax && units && (
                <Legend colorMap={colormapValues} scaleValues={hist[1]} scaleMin={dataRangeMin} scaleMax={dataRangeMax} units={units} />
            )}
        </ReactLeaflet.MapContainer>
    )
}

export default DataMap;