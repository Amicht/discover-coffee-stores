import React from 'react'
import styles from './storesList.module.css' assert { type: 'css' };
import { ICoffeeStore } from '@/interfaces/ICoffeeStore'
import Card from './card'

interface Props{
    title:string
    coffeeStores: ICoffeeStore[]
    onCardClick: () => void
}

const StoresList = (props:Props) => {

    const {coffeeStores,title, onCardClick} = props;

    return (
    <div className={styles.sectionWrapper}>
        <h2 className={styles.heading2}>{title}</h2>
        <div className={styles.cardLayout}>
        {coffeeStores.map((cs) => 
            <Card 
            key={cs.id}
            onCardClick={onCardClick}
            name={cs.name}
            imgUrl={cs.imgUrl}
            href={`/coffee-store/${cs.id}`}/>
            )}
        </div>
    </div>
  )
}

export default StoresList