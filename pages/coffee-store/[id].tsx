import Link from 'next/link'
import { useRouter } from 'next/router'
import { ICoffeeStore, ICoffeeStoreReq } from '@/interfaces/ICoffeeStore'
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

  const createCoffeeStore = async(newCoffeeStore:ICoffeeStoreReq) => {
    try{
      const { 
        id,address,imgUrl,locality,name,voting
      } = newCoffeeStore;

      const dbCoffeeStore = await fetch("/api/createCoffeeStore",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          address,
          locality,
          imgUrl,
          name,
          voting: voting || 0
        })
      })
      .then(res => res.json());

      return dbCoffeeStore;

    }catch(err){
      console.error("error :", err)
    }
  }

  useEffect(() => {

    if(isEmpty(initialProps.coffeeStore)){
      
      if(coffeeStores.length > 0){
        const coffeeStoreById = coffeeStores.find(cs => {
          return cs.id == id;
        });
        
        if(coffeeStoreById){
          console.log(coffeeStoreById);
          
          createCoffeeStore(coffeeStoreById)
            .then((res:ICoffeeStore) => {
              console.log("response from api", res);
              setCoffeeStore(res);
            })
        }
        else{
          if(id){
            createCoffeeStore({id:id.toString()})
              .then((res:ICoffeeStore) => {
                console.log("response from api", res);
                setCoffeeStore(res);
              })
          }
        }
      }
      else{
        if(id){
          createCoffeeStore({id:id.toString()})
            .then((res:ICoffeeStore) => {
              console.log("response from api", res);
              setCoffeeStore(res);
            })
        }
      }
    }
    else{
        const {voting} = initialProps.coffeeStore;
        if(!voting && (voting !== 0)){
          createCoffeeStore(initialProps.coffeeStore)
            .then((res:ICoffeeStore) => {
              console.log("response from api", res);
              setCoffeeStore(res);
            })
        }
    }
  },[id, initialProps.coffeeStore])

  if(router.isFallback){ return <div className={styles.loadingWrapper}>
    <div className={styles.loadingText}>Loading...</div>
  </div> };

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
        {coffeeStore?.address && <div className={styles.iconWrapper}>
            <Image 
              alt='adress-icon' 
              src="/static/icons/places.svg" 
              width="24" 
              height="24" />
            <p className={styles.text}>{coffeeStore?.address}</p>
          </div>}
          {coffeeStore?.locality && <div className={styles.iconWrapper}>
            <Image 
              alt='adress-icon' 
              src="/static/icons/nearMe.svg" 
              width="24" 
              height="24" />
            <p className={styles.text}>{coffeeStore?.locality}</p>
          </div>}
          <div className={styles.iconWrapper}>
            <Image 
              alt='star-icon' 
              src="/static/icons/star.svg" 
              width="24" 
              height="24" />
            <p className={styles.text}>{coffeeStore?.voting}</p>
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