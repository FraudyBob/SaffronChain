// frontend/pages/_app.js

import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

// // frontend/pages/_app.js (nếu có)
// import { useEffect } from "react";
// import { useRouter } from "next/router";

// export default function App({ Component, pageProps }) {
//   const router = useRouter();

//   useEffect(() => {
//     if (router.pathname === "/") {
//       router.push("/login");
//     }
//   }, [router]);

//   return <Component {...pageProps} />;
// }
