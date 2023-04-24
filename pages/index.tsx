import Head from 'next/head'
import Image from 'next/image'

import styles from '@/styles/home.module.css'
import Banner from '@/components/Banner'
import { ICoffeeStore } from '@/interfaces/ICoffeeStore'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import { useTrackLocation } from '@/hooks/use-track-location'
import { useContext, useEffect, useState } from 'react'
import { StoreContext } from '@/store/store-context';
import Loading from '@/components/Loading'
import StoresList from '@/components/StoresList'

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores({limit:6});
  return { props: { coffeeStores } }
}

export default function Home(props:{coffeeStores:ICoffeeStore[]}) {

  const {state:{latLong,coffeeStores},reducer} = useContext(StoreContext);
  const [isLoading,setIsLoading] = useState(false);

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
        const reqUrl = `/api/getCoffeeStoresByLocation?limit=30&latLong=${latLong}`;
        try{
          setIsLoading(true);
          const fetchedCoffeeStores = await fetch(reqUrl).then(res => res.json())
          reducer.saveCoffeeStores(fetchedCoffeeStores.coffeeStores);
          setIsLoading(false);
        }
        catch(error:any) {
          setIsLoading(false);
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
          <Image 
            className={styles.heroImage}
            src="/static/hero-img.png" 
            priority={true}
            width={250}
            height={250}
            alt='hero-image'/>
        
        {locationErrorMsg && <div >
          <p>Error occured: {locationErrorMsg}</p>
        </div>}

        {coffeeStores.length > 0? 
          <StoresList 
            coffeeStores={coffeeStores}
            onCardClick={() => setIsLoading(true)}
            title="Stores near me"
            key={"Stores near me"}/>:null}

        {props.coffeeStores.length > 0? 
          <StoresList 
            coffeeStores={props.coffeeStores}
            onCardClick={() => setIsLoading(true)}
            title="Jerusalem coffee stores"
            key={"Jerusalem stores"}/>:null}
      </main>
      
      {isLoading? <Loading />:null}
    </div>
  )
}
