import styles from './banner.module.css';

interface Props{
    btnText:string 
    handleOnClick: () => void
}

const Banner = (props:Props) => {
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>
            <span className={styles.title1}>Coffee </span> 
            <span className={styles.title2}>Connoisseur</span>
        </h1>
        <p className={styles.subTitle}>Discover your local coffee shops!</p>
        <button onClick={props.handleOnClick} className={styles.button}>{props.btnText}</button>
    </div>
  )
}

export default Banner