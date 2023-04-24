import React from 'react'
import styles from './loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
        <div className={styles.loadingContent}>
            <div className={styles.loader}>Loading...</div>
        </div>
    </div>
  )
}

export default Loading