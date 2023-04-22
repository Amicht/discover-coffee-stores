import Link from 'next/link'
import { useRouter } from 'next/router'
import { ICoffeeStore } from '@/interfaces/ICoffeeStore'
import styles from "../../styles/coffee-store.module.css";
import Head from 'next/head';
import Image from 'next/image';
import cls from 'classnames';
import { fetchCoffeeStores, getDefaultCoffeeStorePhoto } from '@/lib/coffee-stores';
import { useContext, useEffect, useState } from 'react';
import { isEmpty } from '@/utils';
import { StoreContext } from '@/store/store-context';


export async function getStaticProps(staticProps:any) {
  const params = staticProps.params;
  const coffeeStoresData = await fetchCoffeeStores({});
  const coffeeStore = coffeeStoresData.find(cs => {
    return cs.id.toString() == params.id;
  })
  return {props: {coffeeStore: coffeeStore? coffeeStore: {}}}
}

type StaticPath = Array<string | { params: { [key: string]: string } }>;

export async function getStaticPaths(): Promise<{paths:StaticPath, fallback:boolean}>{
  
  const coffeeStoresData = await fetchCoffeeStores({});
  
  const paths = coffeeStoresData.map(cs => {
    return {params: { id: cs.id.toString() } }
  })
  
  return {
    paths,
    fallback: true
  }
}

const CoffeeStore = (initialProps:{coffeeStore:ICoffeeStore,notFound?:boolean}) => {
  const router = useRouter();
  const {state:{coffeeStores}} = useContext(StoreContext);
  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = 
    useState<ICoffeeStore>(initialProps.coffeeStore);

  const dafaultCoffeeStorePhoto = getDefaultCoffeeStorePhoto();

  
  const handleUpvoteButton = () => {};


  useEffect(() => {

    console.log(initialProps.coffeeStore);

    if(isEmpty(initialProps.coffeeStore)){
      
      if(coffeeStores.length > 0){
        const coffeeStoreById = coffeeStores.find(cs => {
          return cs.id.toString() == id;
        });
        if(coffeeStoreById){
          setCoffeeStore(coffeeStoreById);
        }
      }
    }
  },[id])

  if(router.isFallback){ return <div>Loading...</div> }
  if(initialProps.notFound){ return <div>404 ERROR</div> }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore?.name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
            <span style={{paddingRight:"0.25rem"}}>◀</span> Back to home
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore?.name}</h1>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image
              src={coffeeStore?.imgUrl || dafaultCoffeeStorePhoto}
              width={600}
              height={360}
              className={styles.storeImg}
              alt={coffeeStore?.name || "default photo image"}
            />
          </div>
        </div>

        <div className={cls( "glass",styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image 
              alt='adress-icon' 
              src="/static/icons/places.svg" 
              width="24" 
              height="24" />
            <p className={styles.text}>{coffeeStore?.address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image 
              alt='adress-icon' 
              src="/static/icons/nearMe.svg" 
              width="24" 
              height="24" />
            <p className={styles.text}>{coffeeStore?.locality}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image 
              alt='star-icon' 
              src="/static/icons/star.svg" 
              width="24" 
              height="24" />
            <p className={styles.text}>1</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>

        </div>
      </div>
    </div>
  )
}

export default CoffeeStore