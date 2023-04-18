import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import Footer from '@/components/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <nav>
      <ul >
        <li>
          <Link href={'/'} >Home</Link>
        </li>
        <li>
          <Link href={'/about'} >About</Link>
        </li>
      </ul>
    </nav>
    <Component {...pageProps} />
    <Footer />
  </>
}
