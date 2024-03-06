import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as d3 from 'd3';

type ColorMapLegendProps = {
    colorMap: Array<[[number, number], [number, number, number]]>;
    scaleValues: number[];
    scaleMin: number;
    scaleMax: number;
    units: string;
};

const ColorMapLegend: React.FC<ColorMapLegendProps> = ({ colorMap, scaleValues, scaleMin, scaleMax, units }) => {
    
    const map = useMap();

    useEffect(() => {
        const legend = new L.Control({ position: 'topright' });
        let localColorMap = colorMap;
        let localScaleValues = scaleValues;
        let localScaleMin = scaleMin;
        let localScaleMax = scaleMax;

        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            div.style.backgroundColor = "#3c3c3c";
            div.innerHTML = `<h4 style="text-align:center">${units}</h4>`;
            let labels = [];
            let from;
            let to;

            if (localColorMap.length > 8 || localScaleValues.length > 8) {
                let minColor = localColorMap[0];
                let maxColor = localColorMap[localColorMap.length - 1];
                let stepColor = Math.floor((localColorMap.length - 2) / 8);
                let stepScale = Math.floor((localScaleValues.length - 2) / 8);
                let newColorMap = [minColor];
                let newScaleValues = [localScaleMin];

                for (let i = 1; i <= 8; i++) {
                    if (localColorMap.length > 8) {
                        newColorMap.push(localColorMap[i * stepColor]);
                    }
                    if (localScaleValues.length > 8) {
                        let index = Math.round(localScaleValues[i * stepScale]*100)/100;
                        newScaleValues.push(index);
                    }
                }

                newColorMap.push(maxColor);
                newScaleValues.push(localScaleMax);

                localColorMap = newColorMap;
                localScaleValues = newScaleValues;
            }

            for (let i = 0; i < colorMap.length; i++) {
                from = localScaleValues[i];
                to = localScaleValues[i+1];
                let color = d3.color(`rgb(${localColorMap[i][1][0]}, ${localColorMap[i][1][1]}, ${localColorMap[i][1][2]})`);
                let hexColor = color ? color.formatHex() : '#000000'; // default to black if color is undefined
                labels.push(
                    '<i style="background:' +
                        hexColor +
                        '"></i> ' +
                        from +
                        (to ? '&ndash;' + to : '+')
                );
            }

            div.innerHTML += labels.join('<br>');
            return div;
        };

        legend.addTo(map);

        return () => {
            map.removeControl(legend);
        };
    }, [map, colorMap, scaleValues, scaleMin, scaleMax, units]);

    return null;
};


type LegendProps = ColorMapLegendProps;

const Legend: React.FC<LegendProps> = (props) => {
    return <ColorMapLegend  {...props} />;
};

export default Legend;
