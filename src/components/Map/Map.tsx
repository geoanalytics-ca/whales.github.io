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

    type ColorMapType = Array<[[number, number], [number, number, number]]>;

    const [tileJson, setTileJson] = useState<any>(null);
    const [hist, setHist] = useState<number[][]>([]);
    const [colormapValues, setColormapValues] = useState<ColorMapType>([]);
    const [bandExpression, setBandExpression] = useState<string>('');
    const [dataRangeMin, setDataRangeMin] = useState<number>();
    const [dataRangeMax, setDataRangeMax] = useState<number>();

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
        const calculateBandExpression = () => {
            let expression: string = '';
            let histMin: number = hist[1][0];
            let histMax: number = hist[1][hist[1].length-1];
            expression = `(b1 - ${histMin}) / (${histMax} - ${histMin}) * 255`
            setBandExpression(expression);
        };
        if (hist.length > 0) {
            calculateBandExpression();
        }
    }, [hist]);

    useEffect(() => {
        const createScaleColorMap = () => {
            let colorMap: ColorMapType = [];
            let histMax = hist[1][hist[1].length-1];
            let histMin = hist[1][0];
            setDataRangeMin(histMin);
            setDataRangeMax(histMax);
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
            setColormapValues(colorMap);
        };
        if (hist.length > 0) {
            createScaleColorMap();
        }
    }, [hist]);

    useEffect(() => {
        const fetchStatistics = () => {
            let thisHist: number[][] = [];
            axios.get(
                `${titilerBaseUrl}/cog/statistics`, {
                params: {
                    url: mapData,
                    pmin: 2, 
                    pmax: 98, 
                    histogram_bins: 100,
                    histogram_range: dataRange.join(",")
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
                thisHist = respData['b1']['histogram'] as number[][];
                setHist(thisHist);
            });
        };
        if (mapData && dataRange.length > 0) {
            fetchStatistics();
        }
    }, [mapData, dataRange]);

    // useEffect(() => {
    //     if (hist) {
    //         calculateBandExpression();
    //         createScaleColorMap();
    //     }
    // }, [hist, calculateBandExpression, createScaleColorMap]);

    useEffect(() => {
        console.log('mapData: ', mapData);
        console.log('colormapValues: ', colormapValues);
        console.log('bandExpression: ', bandExpression);
        const fetchTileJson = async () => {
            await axios.get(
                    `${titilerBaseUrl}/cog/tilejson.json`, {
                params: {
                    url: mapData,
                    rescale: dataRange.join(","),
                    colormap: JSON.stringify(colormapValues),
                    expression: bandExpression
                },
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
        if (mapData && colormapValues.length > 0) {
            fetchTileJson();
        }
    }, [mapData, colormapValues, bandExpression, dataRange]);

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
            {hist && colormapValues.length != 0 && dataRangeMin && dataRangeMax && units && (
                <Legend colorMap={colormapValues} scaleValues={hist[1]} scaleMin={dataRangeMin} scaleMax={dataRangeMax} units={units} />
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