'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import ProductList from '@/components/productList';
import HomeHero from '@/components/homeHero';
import styles from '@styles/Home.module.scss';

import React, { useEffect, useRef } from 'react';
import MapComponent from '@components/Map';

export default function Home() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      const { offsetWidth, offsetHeight } = divRef.current;
      // Use the calculated width and height in the Map component
      <MapComponent children={undefined} className={''} width={offsetWidth} height={offsetHeight} defaultX={0} defaultY={0} defaultZoom={0} />;
    }
  }, [divRef]);

  return (
    <div>
      <div ref={divRef}>
        {/* Rest of the code */}
      </div>
    </div>
  );
}
