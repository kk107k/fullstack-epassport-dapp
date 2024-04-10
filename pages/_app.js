import "@/styles/globals.css";
import React from 'react';
import { AuthProvider } from './AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;

