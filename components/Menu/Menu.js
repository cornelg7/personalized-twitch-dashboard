import React from 'react';
import Loading from '../Loading';
import styles from '../../styles/Menu.module.scss';

const Menu = ({ pageState, setPageState }) => {
  const onPlay = () => {
    setPageState({
      state: 'Questions', 
      data: {
        questionNumber: 1, 
        questions: pageState.data?.questions,
        question: pageState.data?.questions[0],
        score: 0
      }
    })
  }

  return (
    <div className={styles.menuContainer}>
      <div className={styles.tutorialCard}>
        <div className={styles.tutorialHeading}>
          <span className={styles.tutorialHeadingEmoji}>📜</span><b>Rules</b>
        </div>
        <div className={styles.tutorialText}>
          Given a streamer name, stream title and a thumbnail, guess what category they're streaming in.
        </div>
      </div>

      {pageState.data?.loading &&
       <Loading/>
      }
      <button
        disabled={!!pageState.data?.loading}
        onClick={() => onPlay()}>
        PLAY
      </button>
    </div>
  )
}

export default Menu;