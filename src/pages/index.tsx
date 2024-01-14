import { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import Layout from '@components/Layout';
import { Card } from '@nextui-org/react';

import { mapMarker } from "../types/map";

const MapComponent = dynamic(() => {
    return import('@components/Map')
}, {
    ssr: false,
});

const TableComponent = dynamic(() => {
    return import('@components/Table')
});

const Stream1 = () => {
  const [mapCenter, setMapCenter] = useState<number[]>([47.733359, -62.465233]);
  const [mapZoom, setMapZoom] = useState<number>(8);
  const [mapData, setMapData] = useState<string>('');
  const [mapMarkers, setMapMarkers] = useState<mapMarker[]>([]);

    console.log('Starting up Stream 1 UI')
    return (
        <>
            <Layout className='layout'>
            <Head>
                <title>DataMap</title>
                <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" /> 
                <link rel="icon" href="/favicon.ico" />
            </Head>
              <MapComponent className="stream1-map" center={mapCenter} zoom={mapZoom} mapData={mapData} mapMarkers={mapMarkers} >
              </MapComponent>
              {/* <Card> */}
                  <TableComponent setMapCenter={setMapCenter} setMapZoom={setMapZoom} setMapMarkers={setMapMarkers}>
                  </TableComponent>
              {/* </Card> */}
            </Layout>
        </>
    )
}

export default Stream1;