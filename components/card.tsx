import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from './card.module.css'
import cls from 'classnames';

interface Props{
    name:string
    imgUrl:string
    href:string
}

const Card = (props:Props) => {
  return (
    <Link 
        href={props.href} 
        className={styles.cardLink}>

        <div className={cls("glass",styles.container)}>
            <div className={styles.cardHeaderWrapper}>
                <h2 className={styles.cardHeader}>{props.name}</h2>
            </div>

            <div className={styles.cardImageWrapper}>
                <Image 
                    className={styles.cardImage}
                    alt='card-img'
                    width={260}
                    height={160}
                    src={props.imgUrl} />
            </div>
        </div>
    </Link>
  )
}

export default Card