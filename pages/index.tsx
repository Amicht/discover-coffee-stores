import Head from 'next/head'
import Image from 'next/image'

import styles from '@/styles/home.module.css'
import Banner from '@/components/Banner'
import Card from '@/components/card'



export default function Home() {

  const handleOnBannerBtnClick = () => {
    console.log("Banner btn clicked!");
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner btnText={'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}/>
        <div className={styles.heroImage}>
          <Image 
            className={styles.heroImage}
            src="/static/hero-img.png" 
            width={250}
            height={250}
            alt='hero-image'/>
        </div>
        <div className={styles.cardLayout}>
          {[0,1,2,3,4].map((a, idx) => 
            <Card 
              key={idx}
              name='Caffe Neeman'
              imgUrl='/static/hero-img.png'
              href='/coffee-store/caffe-neeman'/>
              )}
        </div>
      </main>
    </div>
  )
}
