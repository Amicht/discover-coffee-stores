import Head from 'next/head'
import Image from 'next/image'

import styles from '@/styles/home.module.css'
import Banner from '@/components/Banner'
import Card from '@/components/card'
import { ICoffeeStore } from '@/interfaces/ICoffeeStore'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import { useTrackLocation } from '@/hooks/use-track-location'
import { useContext, useEffect, useState } from 'react'
import { StoreContext } from '@/store/store-context';

export async function getStaticProps() {

  const coffeeStores = await fetchCoffeeStores({limit:6});

  return {
    props: { coffeeStores }, 
  }
}

export default function Home(props:{coffeeStores:ICoffeeStore[]}) {

  const [coffeeStoresError,setCoffeeStoresError ] = useState<string | null>(null);
  const {state:{latLong,coffeeStores},reducer} = useContext(StoreContext);

  const { 
    handleTrackLocation, 
    locationErrorMsg, 
    isFindingLocation } = useTrackLocation();

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  }  

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if(!!latLong){
        try{
          // const ll ="31.785123,35.208340"
          const reqUrl = `/api/getCoffeeStoresByLocation?limit=30&latLong=${latLong}`;
          const fetchedCoffeeStores = await fetch(reqUrl).then(res => res.json())
          reducer.saveCoffeeStores(fetchedCoffeeStores.coffeeStores);
        }
        catch(error:any) {
          setCoffeeStoresError(error.message)
        }
      }
    }
 
    setCoffeeStoresByLocation();

  }, [latLong])

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner btnText={isFindingLocation? 'Locating...': 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}/>
        <div className={styles.heroImage}>
          <Image 
            className={styles.heroImage}
            src="/static/hero-img.png" 
            width={250}
            height={250}
            alt='hero-image'/>
        </div>
        {locationErrorMsg && <div >
          <p>Error occured: {locationErrorMsg}</p>
        </div>}
        {coffeeStores.length > 0 && 
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Stores near me</h2>
          <div className={styles.cardLayout}>
            {coffeeStores.map((cs) => 
              <Card 
                key={cs.id}
                name={cs.name}
                imgUrl={cs.imgUrl}
                href={`/coffee-store/${cs.id}`}/>
                )}
          </div>
        </div>}
        {props.coffeeStores.length > 0 && 
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Jerusalem Coffee Stores</h2>
          <div className={styles.cardLayout}>
            {props.coffeeStores.map((cs) => 
              <Card 
                key={cs.id}
                name={cs.name}
                imgUrl={cs.imgUrl}
                href={`/coffee-store/${cs.id}`}/>
                )}
          </div>
        </div>}
      </main>
    </div>
  )
}
