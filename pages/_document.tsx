import { Html, Head, Main, NextScript } from 'next/document'
import Image from 'next/image'

export default function Document() {

  const keywords = [
    "Coffee Connoisseur",
    "Next.js",
    "Coffee",
    "Amicht",
    "Amit Licht",
    "coffee stores",
    "Typescript",
  ]

  return (
    <Html lang="en">
      <Head >
        <meta name="author" content="Amit Licht" />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="theme-color" content="#4338ca" />
      </Head>
      <body >
        <Main />
        <Image 
          className='backgroundImg'
          src="/static/background.png"
          alt='background-color'
          width={1000}
          height={1000} />
        <NextScript />
      </body>
    </Html>
  )
}
