import { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import Layout from '@components/Layout';
import { Card } from '@nextui-org/react';
import { LatLngExpression } from 'leaflet';


const MapComponent = dynamic(() => {
    return import('@components/Map')
}, {
    ssr: false,
});

const TableComponent = dynamic(() => {
    return import('@components/Table')
});

const Home = () => {
    const [mapMarkers, setMapMarkers] = useState<LatLngExpression[]>([]);
    const [mapCenter, setMapCenter] = useState<LatLngExpression>([38.907132, -77.036546]);
    const [mapZoom, setMapZoom] = useState<number>(12);
    console.log('Starting up Stream 1 UI')
    return (
        <>
            <Layout className='layout'>
            <Head>
                <title>DataMap</title>
                <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
                <MapComponent className="stream1-map" center={mapCenter} zoom={mapZoom} >
                </MapComponent>
                <Card>
                    <TableComponent setMapCenter={setMapCenter}>
                    </TableComponent>
                </Card>
            </Layout>
        </>
    )
}

export default Home;