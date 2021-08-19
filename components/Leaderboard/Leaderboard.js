import React from 'react';
import styles from '../../styles/Leaderboard.module.css';

const Leaderboard = ({ pageState, setPageState }) => {
  return (
    <div>
      <p>Leaderboard...</p>
      <div className={styles.leaderboardContainer}>
        <span className={styles.leaderboardText}>Final score: </span>
        <span className={styles.leaderboardScore}>{pageState.data?.score}</span>
      </div>
      <button onClick={() => setPageState({ state: 'Menu', data: { loading: true } })}>Up for more?</button>
    </div>
  )
}

export default Leaderboard;