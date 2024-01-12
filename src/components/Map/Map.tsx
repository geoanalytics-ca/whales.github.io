import { LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactLeaflet from 'react-leaflet';
import React, { JSX, useEffect, useState } from 'react';
import { mapMarker } from '../../types/map';
import { Button } from '@nextui-org/react';

const DataMap = (props: JSX.IntrinsicAttributes & { className: string; center: number[]; zoom: number; mapData: string, mapMarkers: mapMarker[]}) => {
    const { className, center, zoom, mapData, mapMarkers } = props;
    const [tileJson, setTileJson] = useState<any>(null);
    const latlngCenter: LatLngExpression = [center[0], center[1]];

    useEffect(() => {
        const fetchTileJson = async () => {
            const response = await fetch(`https://titiler.xyz/cog/tilejson.json?url=${mapData}`);
            const data = await response.json();
            setTileJson(data);
            console.log('TileJSON:', data);
        }
        fetchTileJson();
    }, [mapData]);


    const Tiles = (tileJson: any) => {
        return (
            (tileJson && tileJson.tiles) ? (
                <ReactLeaflet.TileLayer
                    url={tileJson.tiles[0]}
                    tileSize={512}
                    minZoom={2}
                    crossOrigin={false}
                />
            ) : (
                <></>
            )
        )
    };

    return (
        <ReactLeaflet.MapContainer className={className} center={latlngCenter} zoom={zoom} >
            < Tiles tileJson={tileJson} />
            <>{
                (mapMarkers && mapMarkers.length > 0 && (
                    console.log('mapMarkers:', mapMarkers),
                    <></>
                    // mapMarkers.map((marker: mapMarker) => (
                    //     <ReactLeaflet.Marker
                    //         key={marker.det.id}
                    //         position={[marker.det.centroid[0], marker.det.centroid[1]]}
                    //         eventHandlers={{
                    //             click: () => {
                    //                 marker.preview(marker.det.blob_name);
                    //             }
                    //         }}
                    //     >
                    //         <ReactLeaflet.Popup>
                    //             <div>
                    //                 <h2>{marker.det.id}</h2>
                    //                 <p>{marker.det.confidence}</p>
                    //             </div>
                    //         </ReactLeaflet.Popup>
                    //     </ReactLeaflet.Marker>
                    )
                )
            }</>

            <ReactLeaflet.TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
        </ReactLeaflet.MapContainer>
    )
}

export default DataMap;