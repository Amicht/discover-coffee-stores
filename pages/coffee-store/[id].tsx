import Link from 'next/link'
import { useRouter } from 'next/router'
import { ICoffeeStore, ICoffeeStoreReq } from '@/interfaces/ICoffeeStore'
import styles from "../../styles/coffee-store.module.css" assert { type: 'css' };
import Head from 'next/head';
import Image from 'next/image';
import cls from 'classnames';
import { fetchCoffeeStores, getDefaultCoffeeStorePhoto } from '@/lib/coffee-stores';
import { useContext, useEffect, useState } from 'react';
import { isEmpty } from '@/utils';
import { StoreContext } from '@/store/store-context';
import useSWR from 'swr'
import { fetcher } from '@/lib/swr';
import Loading from '@/components/Loading';


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
  const id = router.query.id;
  const dafaultCoffeeStorePhoto = getDefaultCoffeeStorePhoto();

  const {state:{coffeeStores}} = useContext(StoreContext);
  const [coffeeStore, setCoffeeStore] = useState<ICoffeeStore>(initialProps.coffeeStore);

  const [isVoting, setIsVoting] = useState(false);
  const [votingCount, setVotingCount] = useState<number>(0);
  const {data,error,isLoading} = useSWR(id, fetcher);

  useEffect(() => {
    if(data && data.id){
      setCoffeeStore(data);
      setVotingCount(data.voting);
    }
  },[data]);

  const handleUpvoteButton = async () => {
    try{
      setIsVoting(true);

      const dbCoffeeStore = await fetch("/api/favouriteCoffeeStoreById",{
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id })
      })
      .then(res => res.json());
      
      
      if(dbCoffeeStore){
        setVotingCount(dbCoffeeStore.voting)
      }
      setIsVoting(false);
      
      return dbCoffeeStore;
      
    }catch(err){
      setIsVoting(false);
      // error upvoting coffee-store
      console.error("error upvoting coffee-store:", err)
    }
  };


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

      setCoffeeStore(dbCoffeeStore)
      // setVotingCount(dbCoffeeStore.voting || 0)
      setIsVoting(false);


      return dbCoffeeStore;

    }catch(err){
      // error geting or creating coffee-store
      console.error("error :", err)
    }
  }

  useEffect(() => {
    
    // SSR page check
    if(isEmpty(initialProps.coffeeStore)){
      
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        if(findCoffeeStoreById){
          createCoffeeStore(findCoffeeStoreById);
        }
      }
    } else {
      // SSG
      createCoffeeStore(initialProps.coffeeStore);
      }

  },[id, initialProps.coffeeStore])

  if(router.isFallback || !coffeeStore || 
    !coffeeStore.id || error || initialProps.notFound){ 
    return <div className={styles.loadingWrapper}>
      {router.isFallback || !coffeeStore || !coffeeStore.id? <Loading />: null}
      {initialProps.notFound? <div>404 ERROR</div>:null}
      {error? <div>Something went wrong...</div>:null}
  </div> };

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
              priority={true}
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
              width={24} 
              height={24} />
            <p className={styles.text}>{coffeeStore?.address}</p>
          </div>}
          {coffeeStore?.locality && <div className={styles.iconWrapper}>
            <Image 
              alt='adress-icon' 
              src="/static/icons/nearMe.svg" 
              width={24} 
              height={24} />
            <p className={styles.text}>{coffeeStore?.locality}</p>
          </div>}
          <div className={styles.iconWrapper}>
            <Image 
              alt='star-icon' 
              src="/static/icons/star.svg" 
              width={24} 
              height={24} />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button 
            disabled={isVoting} 
            className={styles.upvoteButton} 
            onClick={handleUpvoteButton}>
            {isVoting? "Voting..." : "Up vote!"}
          </button>

        </div>
      </div>
    </div>
  )
}

export default CoffeeStore