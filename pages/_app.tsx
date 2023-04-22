import { StoreProvider } from '@/store/store-context';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'



export default function App({ Component, pageProps }: AppProps) {
  return <StoreProvider >
    <Component {...pageProps} />
  </StoreProvider>
}
