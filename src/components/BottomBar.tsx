'use client';

import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="bottom-bar w-full fixed bottom-0 left-0 right-0 h-16 bg-black-100 text-white z-50">
        <br />
    </div>
  );
}