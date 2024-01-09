require('@styles/tailwind.css');

import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from '@components/Layout';

import { Card } from '@nextui-org/react';

import React, { useState } from 'react';

import { Catalog, Collection, Item, STACLink } from '@stac/StacObjects';

const MapComponent = dynamic(() => {
  return import('@components/Map')
}, {
  ssr: false,
});

const DataComponent = dynamic(() => {
  return import('@components/DataPane')
});

const Stream2 = () => {
  const [mapCenter, setMapCenter] = useState<number[]>([38.907132, -77.036546]);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [mapData, setMapData] = useState<string>('');

  const [catalog, setCatalog] = useState<Catalog>(); 
  const [collections, setCollections] = useState<Collection[]>([]);     
  const [itemLinks, setItemLinks] = useState<STACLink[]>([]);


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
        <MapComponent className="map" center={mapCenter} zoom={mapZoom} mapData={mapData} >
        </MapComponent>
        <Card>
          <DataComponent 
            mapCenter={mapCenter} setMapCenter={setMapCenter} mapZoom={mapZoom} setMapData={setMapData}
            catalog={catalog} setCatalog={setCatalog} collections={collections} setCollections={setCollections} itemLinks={itemLinks} setItemLinks={setItemLinks}
            >
          </DataComponent>
        </Card>
    </Layout>
    </>
  )
}

export default Stream2;