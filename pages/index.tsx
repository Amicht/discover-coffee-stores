import Head from 'next/head'
import Image from 'next/image'

import styles from '@/styles/home.module.css'
import Banner from '@/components/Banner'
import Card from '@/components/card'
import { ICoffeeStore } from '@/interfaces/ICoffeeStore'
import { fetchCoffeeStores } from '@/lib/coffee-stores'

export async function getStaticProps() {

  const coffeeStores = await fetchCoffeeStores({limit:6});

  return {
    props: { coffeeStores }, 
    // will be passed to the page component as props
  }
}

export default function Home(props:{coffeeStores:ICoffeeStore[]}) {

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
