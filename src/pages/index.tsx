// require('@styles/tailwind.css');

import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from '@components/Layout';

import { Card } from '@nextui-org/react';

import React, { useState } from 'react';

export type mapMarker = {
  lat: number;
  lng: number;
  label: string;
  preview: React.Dispatch<React.SetStateAction<string>>
}

const MapComponent = dynamic(() => {
  return import('@components/Map')
}, {
  ssr: false,
});

const DataComponent = dynamic(() => {
  return import('@components/DataPane')
});

const Stream2 = () => {
  const [mapCenter, setMapCenter] = useState<number[]>([47.733359, -62.465233]);
  const [mapZoom, setMapZoom] = useState<number>(6);
  const [mapData, setMapData] = useState<string|undefined>();
  const [colorMap, setColorMap] = useState<string|undefined>();
  const [dataRange, setDataRange] = useState<number[]>([0,1000])
  const [scale, setScale] = useState<string|undefined>()
  const [units, setUnits] = useState<string|undefined>()

  console.log('Starting up Stream 2 UI')
  return (
    <>
    <Layout className='layout'>
      <Head>
        <title>DataMap</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <MapComponent 
          className="stream2-map" 
          center={mapCenter} zoom={mapZoom} mapData={mapData} 
          colorMapName={colorMap} dataRange={dataRange}
          scale={scale} units={units}
          >
        </MapComponent>
        <Card>
          <DataComponent 
            mapCenter={mapCenter} setMapCenter={setMapCenter} mapZoom={mapZoom} setMapData={setMapData}
            setColorMap={setColorMap} setDataRange={setDataRange} setScale={setScale}
            setUnits={setUnits}
            >
          </DataComponent>
        </Card>
    </Layout>
    </>
  )
}

export default Stream2;