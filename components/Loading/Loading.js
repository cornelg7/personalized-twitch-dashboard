import React from 'react';
import styles from '../../styles/Loading.module.scss';

const Loading = () => {
  return (
    <div>
      <p className={styles.spinner}></p>
    </div>
  )
}

export default Loading;