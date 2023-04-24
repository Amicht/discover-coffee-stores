import styles from './banner.module.css'

interface Props{
    btnText:string 
    handleOnClick: () => void
}

const Banner = (props:Props) => {
  const txts = {
    titles: ["Coffee", "Connoisseur"],
    subTiltle: "Discover your local coffee shops!"
  }
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>
            <span className={styles.title1}>{txts.titles[0]} </span> 
            <span className={styles.title2}>{txts.titles[1]}</span>
        </h1>
        <p className={styles.subTitle}>{txts.subTiltle}</p>
        <button 
          onClick={props.handleOnClick} 
          className={styles.button}>{props.btnText}</button>
    </div>
  )
}

export default Banner