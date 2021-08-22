import React from 'react';
import styles from '../../styles/Leaderboard.module.scss';

const Leaderboard = ({ pageState, setPageState, NUMBER_OF_QUESTIONS }) => {
  return (
    <div className={`${styles.leaderboardContainer}`}>
      <div className={`${styles.leaderboardContainerInner} ${styles.card}`}>
        <span className={styles.leaderboardText}>Final score: </span>
        <span className={styles.leaderboardScore}>{pageState.data?.score} / {NUMBER_OF_QUESTIONS * 10}</span>
      </div>
      <button onClick={() => setPageState({ state: 'Menu', data: { loading: true } })}>Up for more?</button>
    </div>
  )
}

export default Leaderboard;