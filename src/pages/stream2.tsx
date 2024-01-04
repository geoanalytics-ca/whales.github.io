import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from '@components/Layout';

import { Card } from '@nextui-org/react';

import React, { Dispatch, SetStateAction } from 'react';

const MapComponent = dynamic(() => {
  return import('@components/Map')
}, {
  ssr: false,
});

const DataComponent = dynamic(() => {
  return import('@components/DataPane')
});

const Stream2 = (
  { mapCenter, setMapCenter, mapZoom } : { mapCenter: number[], setMapCenter: Dispatch<SetStateAction<number[]>>, mapZoom: number}
) => {
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
        <MapComponent className="map" center={mapCenter} zoom={mapZoom} >
        </MapComponent>
        <Card>
          <DataComponent>
          </DataComponent>
        </Card>
    </Layout>
    </>
  )
}

export default Stream2;