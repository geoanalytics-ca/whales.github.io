import React, { useState, useEffect } from 'react';
import Stream1 from '@pages/stream1';
import Stream2 from '@pages/stream2';

const Index = () => {
  const [Page, setPage] = useState<JSX.Element>(<div></div>);
  const [topMapCenter, setTopMapCenter] = useState<number[]>([38.907132, -77.036546]);
  const [topMapZoom, setTopMapZoom] = useState<number>(12);
  const scenario: string = process.env.NEXT_PUBLIC_STREAM || 'stream1';
  
  return (
    <div>
      {scenario === 'stream1' && (
        <Stream1 mapCenter={topMapCenter} setMapCenter={setTopMapCenter} mapZoom={topMapZoom} />
      )}
      {scenario === 'stream2' && (
        <Stream2 mapCenter={topMapCenter} setMapCenter={setTopMapCenter} mapZoom={topMapZoom} />
      )}
    </div>
  );
};

export default Index;