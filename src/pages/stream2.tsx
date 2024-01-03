import dynamic from 'next/dynamic';
import Head from 'next/head';
import { LatLngExpression } from 'leaflet';
import Layout from '@components/Layout';

import { Card } from '@nextui-org/react';

import React, { useState } from 'react';

const MapComponent = dynamic(() => {
  return import('@components/Map')
}, {
  ssr: false,
});

const DataComponent = dynamic(() => {
  return import('@components/DataPane')
});

const Home = () => {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([38.907132, -77.036546]);
  return (
    <>
    <Layout className='layout'>
      <Head>
        <title>DataMap</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <MapComponent className="map" center={mapCenter} zoom={12} >
        </MapComponent>
        <Card>
          <DataComponent>
          </DataComponent>
        </Card>
    </Layout>
    </>
  )
}

export default Home;