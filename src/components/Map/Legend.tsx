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

    if (!colorMap || colorMap.length === 0) {
        return null;
    }
    if (!scaleValues || scaleValues.length === 0) {
        return null;
    }
    if (!scaleMin || !scaleMax) {
        return null;
    }

    useEffect(() => {
        const legend = new L.Control({ position: 'topright' });

        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            div.style.backgroundColor = "#3c3c3c";
            div.innerHTML = `<h4 style="text-align:center">${units}</h4>`;
            let labels = [];
            let from;
            let to;

            if (colorMap.length > 8 || scaleValues.length > 8) {
                let minColor = colorMap[0];
                let maxColor = colorMap[colorMap.length - 1];
                let stepColor = Math.floor((colorMap.length - 2) / 8);
                let stepScale = Math.floor((scaleValues.length - 2) / 8);
                let newColorMap = [minColor];
                let newScaleValues = [scaleMin];

                for (let i = 1; i <= 8; i++) {
                    if (colorMap.length > 8) {
                        newColorMap.push(colorMap[i * stepColor]);
                    }
                    if (scaleValues.length > 8) {
                        let index = Math.round(scaleValues[i * stepScale]*100)/100;
                        newScaleValues.push(index);
                    }
                }

                newColorMap.push(maxColor);
                newScaleValues.push(scaleMax);

                colorMap = newColorMap;
                scaleValues = newScaleValues;
            }

            for (let i = 0; i < colorMap.length; i++) {
                from = scaleValues[i];
                to = scaleValues[i+1];
                let color = d3.color(`rgb(${colorMap[i][1][0]}, ${colorMap[i][1][1]}, ${colorMap[i][1][2]})`);
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
    }, [map, colorMap, scaleValues]);

    return null;
};


type LegendProps = ColorMapLegendProps;

const Legend: React.FC<LegendProps> = (props) => {
    return <ColorMapLegend  {...props} />;
};

export default Legend;
