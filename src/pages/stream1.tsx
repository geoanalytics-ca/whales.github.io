import { Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import Layout from '@components/Layout';
import { Card } from '@nextui-org/react';


const MapComponent = dynamic(() => {
    return import('@components/Map')
}, {
    ssr: false,
});

const TableComponent = dynamic(() => {
    return import('@components/Table')
});

const Stream1 = (
    { mapCenter, setMapCenter, mapZoom } : { mapCenter: number[], setMapCenter: Dispatch<SetStateAction<number[]>>, mapZoom: number}
    ) => {
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

export default Stream1;