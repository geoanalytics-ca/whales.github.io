// import { useEffect, useState } from 'react'

// const Home = () => {
//   const [Component, setComponent] = useState<(() => JSX.Element) | null>(null);

//   useEffect(() => {
//     const redirectStream = async () => {
//       const scenario = process.env.NEXT_PUBLIC_STREAM
//       let component;
//       if (scenario === 'stream1') {
//         console.log('Redirecting to stream1')
//         component = await import('@pages/stream1').then((mod) => mod.default)
//       } else if (scenario === 'stream2') {
//         console.log('Redirecting to stream2')
//         component = await import('@pages/stream2').then((mod) => mod.default)
//       } else {
//         component = () => <div>Scenario not found</div>
//       }
//       setComponent(component);
//     }

//     redirectStream();
//   }, [])

//   return (
//     <>
//       <div className='layout'>
//         {Component ? <Component /> : 'Loading...'}
//       </div>
//     </>
//   )
// }

// export default Home;

import Home from '@pages/stream1';

export default Home;