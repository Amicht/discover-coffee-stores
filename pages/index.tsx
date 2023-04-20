import Head from 'next/head'
import Image from 'next/image'

import styles from '@/styles/home.module.css'
import Banner from '@/components/Banner'
import Card from '@/components/card'
import coffeeStoresData from '../data/coffee-stores.json'
import { ICoffeeStore } from '@/interfaces/ICoffeeStore'

export async function getStaticProps(context:any) {
  return {
    props: {
      coffeeStores: coffeeStoresData
    }, // will be passed to the page component as props
  }
}

export default function Home(props:{coffeeStores:ICoffeeStore[]}) {

  const handleOnBannerBtnClick = () => {
    console.log("Banner btn clicked!");
  }

  console.log(props);
  

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
        {props.coffeeStores.length > 0 && 
        <>
          <h2 className={styles.heading2}>Toronto Stores</h2>
          <div className={styles.cardLayout}>
            {props.coffeeStores.map((cs) => 
              <Card 
                key={cs.id}
                name={cs.name}
                imgUrl={cs.imgUrl}
                href={`/coffee-store/${cs.id}`}/>
                )}
          </div>
        </>}
      </main>
    </div>
  )
}
